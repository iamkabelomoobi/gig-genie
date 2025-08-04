import { adminRepository } from '../../../db/repositories';

export const adminQueries = {
  admins: async () => {
    return await adminRepository.findAll();
  },
  admin: async (_: any, { id }: { id: string }) => {
    return await adminRepository.findById(id);
  },
};
