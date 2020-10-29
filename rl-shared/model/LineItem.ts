class LineItem {
  id: string | undefined; //"https://unicon.instructure.com/api/lti/courses/786/line_items/280";
  scoreMaximum: number | undefined;
  label: string | undefined;
  resourceLinkId: string | undefined;

  constructor(data: Partial<LineItem> | undefined) {
    if (data) {
      Object.assign(this, data);
    } else {
      this.id = "https://unicon.instructure.com/api/lti/courses/786/line_items/280";
      this.scoreMaximum = 100;
      this.label = "Math Assignment";
      this.resourceLinkId = "6fed5651-0171-4d45-afb4-0b262dd801e5";
    }
  }
}

export default LineItem;