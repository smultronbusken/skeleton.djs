import { Class } from "./Importer";

/**
 * Represents a handler for importing objects.
 */
export default interface ImportHandler<J> {
  /**
   * The class of the objects to be imported.
   */
  classToBeImported: Class<J>;

  /**
   * @param importedObject The object that was imported.
   */
  onImport(importedObject: J): void;
}
