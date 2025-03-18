
export const formatKey = (key: string) => {
  const mapping: { [key: string]: string } = {
    firstName: "First Name",
    lastName: "Last Name",
    suffix: "Suffix",
    phoneNumber: "Phone Number",
    email: "Email",
    userName: "Username",
    password: "Password",
    region: "Assigned Region",
    province: "Assigned Province",
    city: "Assigned City",
    barangay: "Assigned Barangay",
    street: "Assigned Address",
  };
  return mapping[key] || key;
};