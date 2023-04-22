import AssignOwnership from './Provinces/AssignOwnership';
import BuildFactory from './Provinces/Factory/Build';

export default class InitializeWorldMap {
    #imperial2030Game;

    #assignProvinceOwnership;
    #buildFactories;

    constructor(imperial2030Game) {
        this.#imperial2030Game = imperial2030Game;

        this.#assignProvinceOwnership = new AssignOwnership();
        this.#buildFactories = new BuildFactory();
    }

    initialize() {
        this.#initializeRussianHomeProvinces();
        this.#initializeChineseHomeProvinces();
        this.#initializeIndianHomeProvinces();
        this.#initializeBrazillianHomeProvinces();
        this.#initializeUnitedStatesHomeProvinces();
        this.#initializeEuropeanHomeProvinces();

        this.#initializeRailroads();
    }
    #initializeRussianHomeProvinces() {
        const easternEurope = this.map.EasternEurope;
        const russia = this.#imperial2030Game.Russia;

        this.#assignProvinceOwnership.assignAsHomeProvince(easternEurope.Murmansk, russia);
        this.#assignProvinceOwnership.assignAsHomeProvince(easternEurope.Moscow, russia);
        this.#assignProvinceOwnership.assignAsHomeProvince(easternEurope.Novosibirsk, russia);
        this.#assignProvinceOwnership.assignAsHomeProvince(easternEurope.Vladivostok, russia);

        this.#buildFactories.buildArmsFactory(easternEurope.Moscow);
        this.#buildFactories.buildNavalFactory(easternEurope.Vladivostok);
    }
    #initializeChineseHomeProvinces() {
        const eastAsia = this.map.EastAsia;
        const china = this.#imperial2030Game.China;

        this.#assignProvinceOwnership.assignAsHomeProvince(eastAsia.Beijing, china);
        this.#assignProvinceOwnership.assignAsHomeProvince(eastAsia.Urumqi, china);
        this.#assignProvinceOwnership.assignAsHomeProvince(eastAsia.Chongqing, china);
        this.#assignProvinceOwnership.assignAsHomeProvince(eastAsia.Shanghai, china);

        this.#buildFactories.buildArmsFactory(eastAsia.Beijing);
        this.#buildFactories.buildNavalFactory(eastAsia.Shanghai);
    }
    #initializeIndianHomeProvinces() {
        const southAsia = this.map.SouthernAsia;
        const india = this.#imperial2030Game.India;

        this.#assignProvinceOwnership.assignAsHomeProvince(southAsia.Mumbai, india);
        this.#assignProvinceOwnership.assignAsHomeProvince(southAsia.NewDelhi, india);
        this.#assignProvinceOwnership.assignAsHomeProvince(southAsia.Chennai, india);
        this.#assignProvinceOwnership.assignAsHomeProvince(southAsia.Kolkata, india);

        this.#buildFactories.buildArmsFactory(southAsia.NewDelhi);
        this.#buildFactories.buildNavalFactory(southAsia.Mumbai);
    }
    #initializeBrazillianHomeProvinces() {
        const southAmerica = this.map.SouthAmerica;
        const brazil = this.#imperial2030Game.Brazil;

        this.#assignProvinceOwnership.assignAsHomeProvince(southAmerica.Manaus, brazil);
        this.#assignProvinceOwnership.assignAsHomeProvince(southAmerica.Fortaleza, brazil);
        this.#assignProvinceOwnership.assignAsHomeProvince(southAmerica.Brasilia, brazil);
        this.#assignProvinceOwnership.assignAsHomeProvince(southAmerica.RioDeJanerio, brazil);

        this.#buildFactories.buildArmsFactory(southAmerica.Brasilia);
        this.#buildFactories.buildNavalFactory(southAmerica.RioDeJanerio);
    }
    #initializeUnitedStatesHomeProvinces() {
        const northAmerica = this.map.NorthAmerica;
        const unitedStates = this.#imperial2030Game.UnitedStates;

        this.#assignProvinceOwnership.assignAsHomeProvince(northAmerica.SanFrancisco, unitedStates);
        this.#assignProvinceOwnership.assignAsHomeProvince(northAmerica.Chicago, unitedStates);
        this.#assignProvinceOwnership.assignAsHomeProvince(northAmerica.NewYork, unitedStates);
        this.#assignProvinceOwnership.assignAsHomeProvince(northAmerica.NewOrleans, unitedStates);

        this.#buildFactories.buildArmsFactory(northAmerica.Chicago);
        this.#buildFactories.buildNavalFactory(northAmerica.NewOrleans);
    }
    #initializeEuropeanHomeProvinces() {
        const westernEurope = this.map.WesternEurope;
        const europeanUnion = this.#imperial2030Game.EuropeanUnion;

        this.#assignProvinceOwnership.assignAsHomeProvince(westernEurope.London, europeanUnion);
        this.#assignProvinceOwnership.assignAsHomeProvince(westernEurope.Paris, europeanUnion);
        this.#assignProvinceOwnership.assignAsHomeProvince(westernEurope.Berlin, europeanUnion);
        this.#assignProvinceOwnership.assignAsHomeProvince(westernEurope.Rome, europeanUnion);

        this.#buildFactories.buildArmsFactory(westernEurope.Berlin);
        this.#buildFactories.buildNavalFactory(westernEurope.London);
    }

    #initializeRailroads() {
        for (const nation of this.#imperial2030Game.allNations()) {
            for (const homeProvince of nation.homeProvinces) {
                homeProvince.hasRailroad = true;
            }
        }
    }
}