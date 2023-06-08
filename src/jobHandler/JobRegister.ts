import { Class } from "../Importer";

export default interface RegistrationHandler<J> {
  jobType: Class<J>;
  onRegister(job: J): void;
}
