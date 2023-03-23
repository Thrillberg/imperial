export default class Province_Factory_Build {
    constructor(province) {
        this.province = province;
    }

    buildArmsFactory() {
        this.province.hasArmsFactory = true;
    }
    buildNavalFactory() {
        this.province.hasNavalFactory = true;
    }
}