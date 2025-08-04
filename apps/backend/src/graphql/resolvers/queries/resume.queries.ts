import { resumeRepository } from '../../../db/repositories/resume.repository';

export const resumeQueries = {
  resumes: async () => {
    return await resumeRepository.findAll();
  },
  resume: async (_: any, { id }: { id: string }) => {
    return await resumeRepository.findById(id);
  },
};
