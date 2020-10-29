class SubmitGradeParams {
  grade: number | undefined;
  comment: string | undefined;
  activityProgress: string | undefined;
  gradingProgress: string | undefined;

  constructor(data: Partial<SubmitGradeParams> | undefined | null) {
    if (data) {
      Object.assign(this, data);
    } else {
      this.grade = 81;
      this.comment = "Instructor comment on the student performance";
      this.activityProgress = "Completed";
      this.gradingProgress = "FullyGraded";
    }
  }
}

export default SubmitGradeParams;
