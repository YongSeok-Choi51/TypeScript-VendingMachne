import { DefaultVendingMachineResourceRepository } from './DefaultVendingMachineResourceRepository';
import { OrderRepository } from './OrderRepository';
import { ProductRepository } from './ProductRepository';
import { ProductResourceRepository } from './ProductResourceRepository';
import { ResourceRepository } from './ResourceRepository';
import { VendingMachineRepository } from './VendingMachineRepository';
import { VendingMachineResourceRepository } from './VendingMachineResourceRepository';

const TotalRepository = {
    vm: new VendingMachineRepository(),
    vmResource: new VendingMachineResourceRepository(),
    defaultVmResource: new DefaultVendingMachineResourceRepository(),
    product: new ProductRepository(),
    productResource: new ProductResourceRepository(),
    resource: new ResourceRepository(),
    order: new OrderRepository()
};

export default TotalRepository;
