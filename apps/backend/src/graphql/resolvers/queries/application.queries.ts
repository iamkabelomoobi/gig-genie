import { applicationRepository } from '../../../db/repositories';

export const applicationQueries = {
  applications: async () => {
    return await applicationRepository.findAll();
  },
  application: async (_: any, { id }: { id: string }) => {
    return await applicationRepository.findById(id);
  },
};
