interface Customer {
  id: number;
  name: string;
  policyNumber: string;
  status: string;
}

const customers: Customer[] = [
  {
    id: 1,
    name: "John Smith",
    policyNumber: "POL1001",
    status: "Active",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    policyNumber: "POL1002",
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Brown",
    policyNumber: "POL1003",
    status: "Expired",
  },
];

export function searchCustomer(
  name: string
): Customer[] {
  return customers.filter(
    (customer) =>
      customer.name
        .toLowerCase()
        .includes(name.toLowerCase())
  );
}


interface Policy {
  policyNumber: string;
  customerId: number;
  product: string;
  status: string;
  premium: number;
}

const policies: Policy[] = [
  {
    policyNumber: "POL1001",
    customerId: 1,
    product: "Auto Insurance",
    status: "Active",
    premium: 1200,
  },
  {
    policyNumber: "POL1002",
    customerId: 2,
    product: "Home Insurance",
    status: "Active",
    premium: 900,
  },
  {
    policyNumber: "POL1003",
    customerId: 3,
    product: "Auto Insurance",
    status: "Expired",
    premium: 1100,
  },
];

export function getCustomerPolicy(
  customerId: number
): Policy[] {
  return policies.filter(
    (policy) =>
      policy.customerId === customerId
  );
}