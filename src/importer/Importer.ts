import fg from "fast-glob";
import path from "path";
import "reflect-metadata";
import ImportHandler from "./ImportHandler";
import { Collection } from "discord.js";

export interface Class<T> {
  new (...args: any[]): T;
}

export class Importer {
  private static metadataKey: string = "importableClass";
  private static fileSearchString = "**/*.bone.(js|ts)";
  private static fgConfig = {
    ignore: ["node_modules"],
  };

  public static Importable(obj: Class<any>) {
    Reflect.defineMetadata(Importer.metadataKey, obj.name, obj.prototype);
  }

  private importHandlers: ImportHandler<any>[] = [];

  async run() {
    let files = await this.find(Importer.fileSearchString, Importer.fgConfig);
    for (const file of files) {
      let filePath = path.join(process.cwd(), "" + file);
      //console.log("Found file: " + filePath.split("\\")[filePath.split("\\").length - 1]);

      let importedObject = await this.import(filePath);
      let nameOfObject = this.getNameOfObject(importedObject);

      console.log("Imported " + importedObject.constructor.name + " from " + file + ".");

      this.handleImport(importedObject, nameOfObject);
    }
  }

  private getNameOfObject(object: Object) {
    let nameOfObject = Reflect.getMetadata(Importer.metadataKey, Reflect.getPrototypeOf(object));
    if (!nameOfObject)
      throw new Error("Object prototype is not decorated with the Importable decorator.");
    return nameOfObject;
  }

  private async find(searchString: string, fgConfig: any = {}) {
    const entries = await fg(searchString, fgConfig);
    return entries;
  }

  private async import(filePath: string): Promise<Object> {
    let { default: object } = await import(filePath);
    if (this.hasPrototypeAndConstructor(object)) {
      return object;
    } else {
      throw new Error(
        "Default export of " + filePath + " must be a object with a prototype and a constructor.",
      );
    }
  }

  private getHandlersWithClass(nameOfObject: string): ImportHandler<any>[] {
    return this.importHandlers.filter(ih => ih.classToBeImported.name == nameOfObject);
  }

  private handleImport(importedObject: Object, nameOfObject: string) {
    let handlers = this.getHandlersWithClass(nameOfObject);
    if (handlers.length > 0) {
      handlers.forEach(h => {
        h.onImport(importedObject);
      });
    } else {
      console.log(
        "Warning: imported " + importedObject.constructor.name + " but no listeners is available",
      );
    }
  }

  importObject(object: Object) {
    if (this.hasPrototypeAndConstructor(object)) {
      let nameOfObject = this.getNameOfObject(object);
      this.handleImport(object, nameOfObject);
    } else {
      throw new Error("Object must be have a prototype and a constructor.");
    }
  }

  addImportHandler<T>(importHandler: ImportHandler<T>) {
    let className = Reflect.getMetadata(
      Importer.metadataKey,
      importHandler.classToBeImported.prototype,
    );

    if (!className)
      throw new Error(
        "Class " + importHandler.classToBeImported.name + " is not decorated with Importable.",
      );

    this.importHandlers.push(importHandler);
  }

  private hasPrototypeAndConstructor(obj: any): boolean {
    // Check if it's null or not an object first
    if (obj === null || typeof obj !== "object") {
      return false;
    }

    // Check if it has a prototype
    const prototype = Object.getPrototypeOf(obj);
    if (prototype === null) {
      return false;
    }

    // Check if it has a constructor
    return typeof obj.constructor === "function";
  }
}

export const Importable = Importer.Importable;
