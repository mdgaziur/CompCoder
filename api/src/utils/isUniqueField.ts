import { Submission } from './../models/Submission';
import { Problem } from './../models/Problem';
import { User } from './../models/User';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';

/**
 * Checks if given field data is unique
 * @param fieldData The of the field
 * @param fieldName The name of the field
 * @param model The model where we will search
 */
export async function isUniqueField(fieldData: string, fieldName: string, model: ReturnModelType<typeof User | typeof Problem | typeof Submission, {}>, currentDocument?: DocumentType<User | Problem | Submission>): Promise<boolean> {
    let query:any = {};
    query[fieldName] = fieldData;
    let result = await model.findOne(query);
    if(result) {
        if(currentDocument) {
            if(result._id.toString() === currentDocument._id.toString()) {
                return true;
            }
            return false;
        }
        else {
            return false;
        }
    } else {
        return true;
    }
}