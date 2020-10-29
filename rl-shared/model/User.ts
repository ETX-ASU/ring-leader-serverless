class User {
  status: string | undefined; // "Active",
  name: string | undefined; // "John Martin",
  picture: string | undefined; // "https://canvas.instructure.com/images/messages/avatar-50.png",
  given_name: string | undefined; // "John",
  family_name: string | undefined; // "Martin",
  email: string | undefined;// "jmartin@unicon.net",
  user_id: string | undefined; // "6281a0fe-bdba-44df-802d-27451ad14b60",
  lti11_legacy_user_id: string | undefined; // "9e21eccc7d16da7b1d01ebd9371d4f0c4822a8d6",
  roles: [string] | undefined; // [ http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"]

  constructor(data: Partial<User> | undefined) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export default User;