class InstructorSubmitGradeParams {
  lineItemId: string | undefined;
  grade: number | undefined;
  userId: string | undefined;
  comment: string | undefined;
  activityProgress: string | undefined;
  gradingProgress: string | undefined;

  constructor(data: Partial<InstructorSubmitGradeParams> | undefined) {
    if (data) {
      Object.assign(this, data);
    } else {
      this.lineItemId = "assignmentId";
      this.grade = 100;
      this.userId = "selectValue";
      this.comment = "Instructor comment on the student performance";
      this.activityProgress = "Completed";
      this.gradingProgress = "FullyGraded";
    }
  }


}

export default InstructorSubmitGradeParams;