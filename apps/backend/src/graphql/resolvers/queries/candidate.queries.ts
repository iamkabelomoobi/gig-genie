import { candidateRepository } from '../../../db/repositories';

export const candidateQueries = {
  candidates: async () => {
    return await candidateRepository.findAll();
  },
  candidate: async (_: any, { id }: { id: string }) => {
    return await candidateRepository.findById(id);
  },
};
