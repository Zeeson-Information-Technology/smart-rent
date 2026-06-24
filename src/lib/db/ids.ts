import { Types } from "mongoose";

export function isValidObjectId(value: string) {
  return Types.ObjectId.isValid(value);
}

export function toObjectId(value: string) {
  return new Types.ObjectId(value);
}
