import { Query, Resolver } from 'type-graphql';

@Resolver()
export class Test {
    @Query(() => String)
    hello() {
        return "Hello Hi"
    }
}