import mongoose from "mongoose";

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}


interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  // NOTE: we don't include a version property as payments do not intend to change. However, it can be good practice to include it anyway
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema({
  orderId: {
    required: true,
    type: String
  },
  stripeId: {
    required: true,
    type: String
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };