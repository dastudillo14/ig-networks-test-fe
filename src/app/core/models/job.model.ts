import { CategoryI } from "./category.model"
import { UserI } from "./user.model"

export interface JobI {
    "id": number,
    "category": CategoryI,
    "created_by": UserI
    "title": string,
    "description": string,
    "location": string,
    "active": boolean,
    "created_at": string

}

export interface RequestJobApplyI {
    "jobpost": number,
    "resume_link": string,
    "experience_years": number,
    "experience_detail": string
}

export interface RequestJobI {    
    "title": string,
    "description": string,
    "location": string,
    "category": number   
}