import { Job, TConstructable } from "../Jobs"

export default interface RegistrationHandler<J extends Job<any>> {
    jobType: TConstructable<J>
    onRegister(job: J): void
}