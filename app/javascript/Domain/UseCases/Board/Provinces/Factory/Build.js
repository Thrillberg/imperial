export default class Build {
  buildArmsFactory(province, undoHistory) {
    if (undoHistory) {
      const originallyHadArmsFactory = province.hasArmsFactory;
      undoHistory.pushUndoOperation(() => { province.hasArmsFactory = originallyHadArmsFactory; });
    }

    province.hasArmsFactory = true;
  }
  buildNavalFactory(province, undoHistory) {
    if (undoHistory) {
      const originallyHadNavalFactory = province.hasNavalFactory;
      undoHistory.pushUndoOperation(() => { province.hasNavalFactory = originallyHadNavalFactory; });
    }

    province.hasNavalFactory = true;
  }
}
