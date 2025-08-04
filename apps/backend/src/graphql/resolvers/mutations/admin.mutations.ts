import { AdminCreateInput } from '../../../types';
import { ResolverFn } from '../../types';
import { adminRepository } from '../../../db/repositories';

export const adminMutations = {
  createAdmin: (async (_, args: AdminCreateInput) => {
    return await adminRepository.create(args);

  }) as ResolverFn<AdminCreateInput>,
};
