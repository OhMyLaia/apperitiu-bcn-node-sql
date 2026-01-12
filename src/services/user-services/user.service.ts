import  User  from "../../models/user-model/user.model.js"

export const getUserById = async (id: string) => {
  return await User.findByPk(id);
};