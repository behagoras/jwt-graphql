import { 
  Arg, 
  Ctx, 
  Field, 
  Mutation, 
  ObjectType, 
  Query, 
  Resolver, 
  UseMiddleware 
} from "type-graphql";
import { User } from "../entity/User";
import { compare, hash } from "bcryptjs";
import { MyContext } from "src/types/MyContext";
import { createRefreshToken, createAccessToken } from "../utils/auth";
import { isAuth } from "../midlewares/isAuth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string
}

@Resolver()
export class UserResolvers {
  @Query(() => String)
  hello() {
    return 'hi hi hi!'
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext) {
    console.log(payload);
    return `your user id is: ${payload!.userId}`;
  }

  @Query(()=>[User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
  ) {
    try {
      const hashedPassword = await hash(password, 12)
      await User.insert({
        email,
        password: hashedPassword
      })
      return true
    } catch (error) {
      console.log( error)
      return false
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
    @Ctx() {res}: MyContext,
  ):Promise<LoginResponse> {
    const user = await User.findOne({where:{email}})

    if(!user) throw new Error("invalid user");

    const valid = await compare(password,  user.password)
    if(!valid) throw new Error("invalid password");

    res.cookie('jid', createRefreshToken(user), {httpOnly:true})
    return { accessToken: createAccessToken(user) };
  }
}