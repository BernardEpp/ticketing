import mongoose from "mongoose";
import PasswordManager from "../services/PasswordManager";

// Interface that describes the properties that are required to create a new user
interface UserAttributes {
    email: string;
    password: string;
}

// Interface that describes the properties of a user model (i.e. the associated methods)
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttributes): UserDoc;
}

// Interface that describes the properties of the user document (i.e. the properties a single! user has)
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: { // formatt the json properties to more generic names and remove unnecessary - mongo specific - information
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttributes) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };