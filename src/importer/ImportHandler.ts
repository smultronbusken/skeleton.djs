import { Class } from "./Importer";

export default interface ImportHandler<J> {
  classToBeImported: Class<J>;
  onImport(importedObject: J): void;
}
