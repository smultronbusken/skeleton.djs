import {
  CommandInteraction,
  APIContextMenuInteraction,
  ApplicationCommandOptionType,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
  APIApplicationCommand,
} from "discord.js";
import fg from "fast-glob";
import path from "path";
import "reflect-metadata";

export interface Class<T> {
  new (...args: any[]): T;
}

export class Importer {

  private static metadataKey: string = "importableClass"
  private static fileSearchString =  "**/*.job.(js|ts)"
  private static fgConfig = {
    ignore: ["node_modules"],
  }

  public static Importable(obj: Class<any>) {
    Reflect.defineMetadata(Importer.metadataKey, obj.name, obj.prototype);
  }

  private listeners: Map<string, [(importedObject: any) => void]> = new Map();
  
  async run() {
    let files = await this.find(Importer.fileSearchString, Importer.fgConfig)
    console.log(files)
    for (const file of files) {

      let filePath = path.join(process.cwd(), "" + file);
      console.log("Found file: " + filePath.split("\\")[filePath.split("\\").length - 1]);

      let importedObject = await this.import(filePath);
      console.log("Importing of object was successful.");

      let nameOfObject = Reflect.getMetadata(Importer.metadataKey, Reflect.getPrototypeOf(importedObject));
      if (!nameOfObject) throw new Error("Object prototype is not decorated with the Importable decorator.")

      this.tellListeners(importedObject, nameOfObject)
    }
  }

  private async find(searchString: string, fgConfig: any = {}) {
    const entries = await fg(searchString, fgConfig);
    return entries
  }

  private async import(filePath: string): Promise<Object> {
    let { default: object } = await import(filePath);
    if (this.hasPrototypeAndConstructor(object)) {
      return object;
    } else {
      throw new Error("Default export of " + filePath + " must be a object with a prototype and a constructor.")
    }
  }


  tellListeners(importedObject: Object, nameOfObject: string) {
    let listeners = this.listeners.get(nameOfObject);
    if (listeners) {
      this.listeners.get(nameOfObject)?.forEach(func => {
        func(importedObject);
      });
    } else {
      console.log("Warning: imported " + importedObject.constructor.name + " but no listeners is available")
    }
  }

  addListener<T>(c: Class<T>, func: (object: T) => void) {

    let className = Reflect.getMetadata(
      Importer.metadataKey,
      c.prototype,
    );

    if (!className) throw new Error("Class " + c.name + " is not decorated with Importable.")

    let listeners = this.listeners.get(className);
    listeners ? listeners.push(func) : this.listeners.set(className, [func])
  }

  hasPrototypeAndConstructor(obj: any): boolean {
    // Check if it's null or not an object first
    if (obj === null || typeof obj !== 'object') {
        return false;
    }
    
    // Check if it has a prototype
    const prototype = Object.getPrototypeOf(obj);
    if (prototype === null) {
        return false;
    }
    
    // Check if it has a constructor
    return typeof obj.constructor === 'function';
  }
  
}

export const Importable = Importer.Importable;
