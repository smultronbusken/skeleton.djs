import fg from "fast-glob";
import path from "path";
import "reflect-metadata";
import ImportHandler from "./ImportHandler";
import { Collection } from "discord.js";

/**
 * Interface representing a JavaScript class.
 */
export interface Class<T> {
  new (...args: any[]): T;
}

/**
 * A class responsible for handling import operations of other classes.
 */
export class Importer {
  private static metadataKey: string = "importableClass";
  private static fileSearchString = "**/*.bone.(js|ts)";
  private static fgConfig = {
    ignore: ["node_modules"],
  };

  /**
   * Defines metadata using `Reflect.defineMetadata` for the class.
   * This data is later used for import handling.
   */
  public static Importable(obj: Class<any>) {
    Reflect.defineMetadata(Importer.metadataKey, obj.name, obj.prototype);
  }

  private importHandlers: ImportHandler<any>[] = [];

  /**
   * Runs the import process, finding and importing all relevant files.
   */
  async run() {
    let files = await this.find(Importer.fileSearchString, Importer.fgConfig);
    for (const file of files) {
      let filePath = path.join(process.cwd(), "" + file);

      let importedObject = await this.import(filePath);
      let nameOfObject = this.getNameOfObject(importedObject);

      console.log("Imported " + importedObject.constructor.name + " from " + file + ".");

      this.handleImport(importedObject, nameOfObject);
    }
  }

  /**
   * Retrieves the name of a given object using metadata.
   * @throws Error if the class of the object is not decorated with the Importable decorator.
   */
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

  /**
   * @throws Error if the default export of the file is not an object with a prototype and a constructor.
   */
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

  /**
   * Retrieve all import handlers for a given class name.
   */
  private getHandlersWithClass(nameOfObject: string): ImportHandler<any>[] {
    return this.importHandlers.filter(ih => ih.classToBeImported.name == nameOfObject);
  }

  /**
   * This will invoke all relevant import handlers for the object. If no handlers are found, a warning is printed to the console.
   */
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

  /**
   * Imports an object manually, and invokes all relevant import handlers
   * @param object - The object to import.
   */
  importObject(object: Object) {
    if (this.hasPrototypeAndConstructor(object)) {
      let nameOfObject = this.getNameOfObject(object);
      this.handleImport(object, nameOfObject);
    } else {
      throw new Error("Object must be have a prototype and a constructor.");
    }
  }

  /**
   * Adds a import handler which will be invoked all when objects of type T is imported
   * @template T A class decorated with `@Importable`
   * @param importHandler - The import handler to add.
   */
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
    if (obj === null || typeof obj !== "object") {
      return false;
    }

    const prototype = Object.getPrototypeOf(obj);
    if (prototype === null) {
      return false;
    }

    return typeof obj.constructor === "function";
  }
}

export const Importable = Importer.Importable;
