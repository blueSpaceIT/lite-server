import { IBranch } from '../modules/branch/branch.interface';
import { Branch } from '../modules/branch/branch.model';
import slugGenerate from '../utils/slugGenerate';

// branch data
const branchData: Partial<IBranch> = {
    name: 'Online',
    code: '00',
    address: 'Online',
    status: 'Active',
};

const seedBranch = async () => {
    branchData.id = slugGenerate(branchData.name as string);

    // check if any online branch
    const isOnlineBranch = await Branch.findOne({ id: branchData.id });
    if (!isOnlineBranch) {
        await Branch.create(branchData);
    }
};

export default seedBranch;
