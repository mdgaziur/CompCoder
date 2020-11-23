import { User } from '../models/User';
import { Query, Resolver } from 'type-graphql';

@Resolver()
export class Test {
    @Query(() => String)
    hello() {
        return "Hello Hi"
    }
    @Query(() => [User])
    async user_db() {
        let userModel = new User().getModelForClass(User);
        return userModel.find();
    }
}