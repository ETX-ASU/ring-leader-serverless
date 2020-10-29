class Student {
  status: string | undefined; // "Active",
  name: string | undefined; // "John Martin",
  picture: string | undefined; // "https://canvas.instructure.com/images/messages/avatar-50.png",
  givenName: string | undefined; // "John",
  familyName: string | undefined; // "Martin",
  email: string | undefined;// "jmartin@unicon.net",
  id: string | undefined; // user_id",


  constructor(data: Partial<Student> | undefined) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

export default Student;