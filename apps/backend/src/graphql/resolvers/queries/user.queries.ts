import { userRepository } from '../../../db/repositories';

export const userQueries = {
  users: async () => {
    return await userRepository.findAll();
  },
  user: async (_: any, { id }: { id: string }) => {
    return await userRepository.findById(id);
  },
};
