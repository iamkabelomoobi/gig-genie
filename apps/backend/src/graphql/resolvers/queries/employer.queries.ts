import { employerRepository } from '../../../db/repositories';

export const employerQueries = {
  employers: async () => {
    return await employerRepository.findAll();
  },
  employer: async (_: any, { id }: { id: string }) => {
    return await employerRepository.findById(id);
  },
};
