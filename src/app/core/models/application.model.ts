import { JobI } from "./job.model"
import { StatusI } from "./status.model"
import { UserI } from "./user.model"

export interface ApplicationI {
    "id": number,
    "applicant": UserI
    "jobpost":JobI,
    "resume_link": string,
    "experience_years": string,
    "experience_detail": string,
    "submission_date": string,
    "status": StatusI
}