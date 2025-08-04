import { jobRepository } from '../../../db/repositories';

export const jobQueries = {
  jobs: async () => {
    return await jobRepository.findAll();
  },
  job: async (_: any, { id }: { id: string }) => {
    return await jobRepository.findById(id);
  },
};
