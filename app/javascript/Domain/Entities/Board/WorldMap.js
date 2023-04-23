import Map from './Map';
import Province from './Province';

export default class WorldMap extends Map {
  #northAmerica;
  #centralAmerica;
  #southAmerica;
  #westernEurope;
  #africa;
  #easternEurope;
  #westernAsia;
  #centralAsia;
  #southernAsia;
  #eastAsia;
  #southEastAsia;
  #oceania;

  #pacificOcean;
  #indianOcean;
  #atlanticOcean;

  get NorthAmerica() {
    return this.#northAmerica;
  }
  get CentralAmerica() {
    return this.#centralAmerica;
  }
  get SouthAmerica() {
    return this.#southAmerica;
  }
  get WesternEurope() {
    return this.#westernEurope;
  }
  get Africa() {
    return this.#africa;
  }
  get EasternEurope() {
    return this.#easternEurope;
  }
  get WesternAsia() {
    return this.#westernAsia;
  }
  get CentralAsia() {
    return this.#centralAsia;
  }
  get SouthernAsia() {
    return this.#southernAsia;
  }
  get EastAsia() {
    return this.#eastAsia;
  }
  get SouthEastAsia() {
    return this.#southEastAsia;
  }
  get Oceania() {
    return this.#oceania;
  }

  get PacificOcean() {
    return this.#pacificOcean;
  }
  get IndianOcean() {
    return this.#indianOcean;
  }
  get AtlanticOcean() {
    return this.#atlanticOcean;
  }

  constructor() {
    super();

    this.#initializeLandProvinces();
    this.#initializeOceanProvinces();

    this.#connectNorthAmericanProvinces();
    this.#connectCentralAmericanProvinces();
    this.#connectSouthAmericanProvinces();
    this.#connectWestEuropeanProvinces();
    this.#connectAfricanProvinces();
    this.#connectEasternEuropeanProvinces();
    this.#connectWesternAsianProvinces();
    this.#connectCentralAsianProvinces();
    this.#connectSouthernAsianProvinces();
    this.#connectEastAsianProvinces();
    this.#connectSouthEastAsianProvinces();
    this.#connectOceanianProvinces();

    this.#connectOceanProvinces();

    this.#initializePorts();
  }
  #initializeLandProvinces() {
    this.#northAmerica = {};
    this.#centralAmerica = {};
    this.#southAmerica = {};
    this.#westernEurope = {};
    this.#africa = {};
    this.#easternEurope = {};
    this.#westernAsia = {};
    this.#centralAsia = {};
    this.#southernAsia = {};
    this.#eastAsia = {};
    this.#southEastAsia = {};
    this.#oceania = {};

    this.#northAmerica.Alaska = new Province('alaska');
    this.#northAmerica.Canada = new Province('canada');
    this.#northAmerica.Quebec = new Province('quebec');
    this.#northAmerica.SanFrancisco = new Province('sanfrancisco');
    this.#northAmerica.Chicago = new Province('chicago');
    this.#northAmerica.NewYork = new Province('newyork');
    this.#northAmerica.NewOrleans = new Province('neworleans');

    this.#centralAmerica.Mexico = new Province('mexico');
    this.#centralAmerica.Colombia = new Province('colombia');

    this.#southAmerica.Peru = new Province('peru');
    this.#southAmerica.Argentina = new Province('argentina');
    this.#southAmerica.Manaus = new Province('manaus');
    this.#southAmerica.Fortaleza = new Province('fortaleza');
    this.#southAmerica.Brasilia = new Province('brasilia');
    this.#southAmerica.RioDeJaneiro = new Province('riodejaneiro');

    this.#westernEurope.London = new Province('london');
    this.#westernEurope.Berlin = new Province('berlin');
    this.#westernEurope.Paris = new Province('paris');
    this.#westernEurope.Rome = new Province('rome');

    this.#africa.NorthAfrica = new Province('northafrica');
    this.#africa.Guinea = new Province('guinea');
    this.#africa.Nigeria = new Province('nigeria');
    this.#africa.EastAfrica = new Province('eastafrica');
    this.#africa.Congo = new Province('congo');
    this.#africa.SouthAfrica = new Province('southafrica');

    this.#easternEurope.Ukraine = new Province('ukraine');
    this.#easternEurope.Murmansk = new Province('murmansk');
    this.#easternEurope.Moscow = new Province('moscow');
    this.#easternEurope.Novosibirsk = new Province('novosibirsk');
    this.#easternEurope.Vladivostok = new Province('vladivostok');

    this.#westernAsia.Turkey = new Province('turkey');
    this.#westernAsia.NearEast = new Province('neareast');
    this.#westernAsia.Iran = new Province('iran');

    this.#centralAsia.Afghanistan = new Province('afghanistan');
    this.#centralAsia.Kazakhstan = new Province('kazakhstan');

    this.#southernAsia.NewDelhi = new Province('newdelhi');
    this.#southernAsia.Mumbai = new Province('mumbai');
    this.#southernAsia.Kolkata = new Province('kolkata');
    this.#southernAsia.Chennai = new Province('chennai');

    this.#eastAsia.Mongolia = new Province('mongolia');
    this.#eastAsia.Korea = new Province('korea');
    this.#eastAsia.Japan = new Province('japan');
    this.#eastAsia.Beijing = new Province('beijing');
    this.#eastAsia.Urumqi = new Province('urumqi');
    this.#eastAsia.Shanghai = new Province('shanghai');
    this.#eastAsia.Chongqing = new Province('chongqing');

    this.#southEastAsia.IndoChina = new Province('indochina');
    this.#southEastAsia.Philippines = new Province('philippines');
    this.#southEastAsia.Indonesia = new Province('indonesia');

    this.#oceania.Australia = new Province('australia');
    this.#oceania.NewZealand = new Province('newzealand');

    const allLandRegions = [
      this.NorthAmerica,
      this.CentralAmerica,
      this.SouthAmerica,
      this.Africa,
      this.WesternEurope,
      this.EasternEurope,
      this.CentralAsia,
      this.SouthernAsia,
      this.EastAsia,
      this.SouthEastAsia,
      this.Oceania,
    ];
    for (const landRegion of allLandRegions) {
      for (const landProvince of Object.values(landRegion)) {
        landProvince.isLand = true;
        this._addProvince(landProvince);
      }
    }
  }
  #initializeOceanProvinces() {
    this.#pacificOcean = {};
    this.#indianOcean = {};
    this.#atlanticOcean = {};

    this.#pacificOcean.NorthPacific = new Province('northpacific');
    this.#pacificOcean.SouthPacific = new Province('southpacific');
    this.#pacificOcean.SeaOfJapan = new Province('seaofjapan');
    this.#pacificOcean.ChinaSea = new Province('chinasea');
    this.#pacificOcean.TasmanSea = new Province('tasmansea');

    this.#indianOcean = new Province('indianocean');

    this.#atlanticOcean.NorthAtlantic = new Province('northatlantic');
    this.#atlanticOcean.MediterraneanSea = new Province('mediterraneansea');
    this.#atlanticOcean.CaribbeanSea = new Province('caribbeansea');
    this.#atlanticOcean.GulfOfGuinea = new Province('gulfofguinea');
    this.#atlanticOcean.SouthAtlantic = new Province('southatlantic');

    const allOceanRegions = [
      this.PacificOcean,
      { IndianOcean: this.IndianOcean },
      this.AtlanticOcean,
    ];
    for (const navalRegion of allOceanRegions) {
      for (const navalProvince of Object.values(navalRegion)) {
        navalProvince.isWater = true;
        this._addProvince(navalProvince);
      }
    }
  }

  #connectNorthAmericanProvinces() {
    this._connect(this.NorthAmerica.Alaska, this.PacificOcean.NorthPacific);
    this._connect(this.NorthAmerica.Alaska, this.NorthAmerica.Canada);

    this._connect(this.NorthAmerica.Canada, this.PacificOcean.NorthPacific);
    this._connect(this.NorthAmerica.Canada, this.AtlanticOcean.NorthAtlantic);
    this._connect(this.NorthAmerica.Canada, this.NorthAmerica.Quebec);
    this._connect(this.NorthAmerica.Canada, this.NorthAmerica.SanFrancisco);
    this._connect(this.NorthAmerica.Canada, this.NorthAmerica.Chicago);
    this._connect(this.NorthAmerica.Canada, this.NorthAmerica.NewYork);

    this._connect(this.NorthAmerica.Quebec, this.AtlanticOcean.NorthAtlantic);
    this._connect(this.NorthAmerica.Quebec, this.NorthAmerica.NewYork);

    this._connect(this.NorthAmerica.SanFrancisco, this.PacificOcean.NorthPacific);
    this._connect(this.NorthAmerica.SanFrancisco, this.NorthAmerica.Chicago);
    this._connect(this.NorthAmerica.SanFrancisco, this.NorthAmerica.NewOrleans);
    this._connect(this.NorthAmerica.SanFrancisco, this.CentralAmerica.Mexico);

    this._connect(this.NorthAmerica.Chicago, this.NorthAmerica.NewYork);
    this._connect(this.NorthAmerica.Chicago, this.NorthAmerica.NewOrleans);

    this._connect(this.NorthAmerica.NewYork, this.AtlanticOcean.NorthAtlantic);
    this._connect(this.NorthAmerica.NewYork, this.NorthAmerica.NewOrleans);

    this._connect(this.NorthAmerica.NewOrleans, this.CentralAmerica.Mexico);
    this._connect(this.NorthAmerica.NewOrleans, this.AtlanticOcean.CaribbeanSea);
  }
  #connectCentralAmericanProvinces() {
    this._connect(this.CentralAmerica.Mexico, this.PacificOcean.NorthPacific);
    this._connect(this.CentralAmerica.Mexico, this.AtlanticOcean.CaribbeanSea);
    this._connect(this.CentralAmerica.Mexico, this.NorthAmerica.SanFrancisco);
    this._connect(this.CentralAmerica.Mexico, this.NorthAmerica.NewOrleans);
    this._connect(this.CentralAmerica.Mexico, this.CentralAmerica.Colombia);

    this._connect(this.CentralAmerica.Colombia, this.PacificOcean.NorthPacific);
    this._connect(this.CentralAmerica.Colombia, this.AtlanticOcean.CaribbeanSea);
    this._connect(this.CentralAmerica.Colombia, this.SouthAmerica.Peru);
    this._connect(this.CentralAmerica.Colombia, this.SouthAmerica.Manaus);
    this._provideCanalAccess(this.CentralAmerica.Colombia, this.PacificOcean.NorthPacific);
    this._provideCanalAccess(this.CentralAmerica.Colombia, this.AtlanticOcean.CaribbeanSea);
  }
  #connectSouthAmericanProvinces() {
    this._connect(this.SouthAmerica.Manaus, this.AtlanticOcean.CaribbeanSea);
    this._connect(this.SouthAmerica.Manaus, this.CentralAmerica.Colombia);
    this._connect(this.SouthAmerica.Manaus, this.SouthAmerica.Peru);
    this._connect(this.SouthAmerica.Manaus, this.SouthAmerica.Brasilia);
    this._connect(this.SouthAmerica.Manaus, this.SouthAmerica.Fortaleza);

    this._connect(this.SouthAmerica.Peru, this.PacificOcean.SouthPacific);
    this._connect(this.SouthAmerica.Peru, this.CentralAmerica.Colombia);
    this._connect(this.SouthAmerica.Peru, this.SouthAmerica.Argentina);
    this._connect(this.SouthAmerica.Peru, this.SouthAmerica.Brasilia);

    this._connect(this.SouthAmerica.Fortaleza, this.AtlanticOcean.CaribbeanSea);
    this._connect(this.SouthAmerica.Fortaleza, this.SouthAmerica.Brasilia);
    this._connect(this.SouthAmerica.Fortaleza, this.SouthAmerica.RioDeJaneiro);

    this._connect(this.SouthAmerica.Brasilia, this.SouthAmerica.RioDeJaneiro);
    this._connect(this.SouthAmerica.Brasilia, this.SouthAmerica.Argentina);

    this._connect(this.SouthAmerica.RioDeJaneiro, this.AtlanticOcean.SouthAtlantic);
    this._connect(this.SouthAmerica.RioDeJaneiro, this.SouthAmerica.Argentina);

    this._connect(this.SouthAmerica.Argentina, this.PacificOcean.SouthPacific);
    this._connect(this.SouthAmerica.Argentina, this.AtlanticOcean.SouthAtlantic);
  }
  #connectWestEuropeanProvinces() {
    this._connect(this.WesternEurope.London, this.AtlanticOcean.NorthAtlantic);
    this._connect(this.WesternEurope.London, this.WesternEurope.Paris);

    this._connect(this.WesternEurope.Berlin, this.AtlanticOcean.NorthAtlantic);
    this._connect(this.WesternEurope.Berlin, this.WesternEurope.Paris);
    this._connect(this.WesternEurope.Berlin, this.WesternEurope.Rome);
    this._connect(this.WesternEurope.Berlin, this.EasternEurope.Murmansk);
    this._connect(this.WesternEurope.Berlin, this.EasternEurope.Ukraine);

    this._connect(this.WesternEurope.Paris, this.AtlanticOcean.NorthAtlantic);
    this._connect(this.WesternEurope.Paris, this.AtlanticOcean.MediterraneanSea);
    this._connect(this.WesternEurope.Paris, this.WesternEurope.Rome);

    this._connect(this.WesternEurope.Rome, this.AtlanticOcean.MediterraneanSea);
    this._connect(this.WesternEurope.Rome, this.EasternEurope.Ukraine);
    this._connect(this.WesternEurope.Rome, this.WesternAsia.Turkey);
  }
  #connectAfricanProvinces() {
    this._connect(this.Africa.NorthAfrica, this.AtlanticOcean.NorthAtlantic);
    this._connect(this.Africa.NorthAfrica, this.AtlanticOcean.MediterraneanSea);
    this._connect(this.Africa.NorthAfrica, this.IndianOcean);
    this._connect(this.Africa.NorthAfrica, this.WesternAsia.NearEast);
    this._connect(this.Africa.NorthAfrica, this.Africa.Guinea);
    this._connect(this.Africa.NorthAfrica, this.Africa.Nigeria);
    this._connect(this.Africa.NorthAfrica, this.Africa.EastAfrica);
    this._provideCanalAccess(this.Africa.NorthAfrica, this.AtlanticOcean.MediterraneanSea);
    this._provideCanalAccess(this.Africa.NorthAfrica, this.IndianOcean);

    this._connect(this.Africa.Guinea, this.AtlanticOcean.NorthAtlantic);
    this._connect(this.Africa.Guinea, this.AtlanticOcean.GulfOfGuinea);
    this._connect(this.Africa.Guinea, this.Africa.Nigeria);

    this._connect(this.Africa.Nigeria, this.AtlanticOcean.GulfOfGuinea);
    this._connect(this.Africa.Nigeria, this.Africa.EastAfrica);
    this._connect(this.Africa.Nigeria, this.Africa.Congo);

    this._connect(this.Africa.EastAfrica, this.IndianOcean);
    this._connect(this.Africa.EastAfrica, this.Africa.Congo);
    this._connect(this.Africa.EastAfrica, this.Africa.SouthAfrica);

    this._connect(this.Africa.Congo, this.AtlanticOcean.GulfOfGuinea);
    this._connect(this.Africa.Congo, this.Africa.SouthAfrica);

    this._connect(this.Africa.SouthAfrica, this.AtlanticOcean.GulfOfGuinea);
    this._connect(this.Africa.SouthAfrica, this.IndianOcean);
  }
  #connectEasternEuropeanProvinces() {
    this._connect(this.EasternEurope.Ukraine, this.WesternEurope.Berlin);
    this._connect(this.EasternEurope.Ukraine, this.WesternEurope.Rome);
    this._connect(this.EasternEurope.Ukraine, this.EasternEurope.Murmansk);
    this._connect(this.EasternEurope.Ukraine, this.EasternEurope.Moscow);

    this._connect(this.EasternEurope.Murmansk, this.AtlanticOcean.NorthAtlantic);
    this._connect(this.EasternEurope.Murmansk, this.WesternEurope.Berlin);
    this._connect(this.EasternEurope.Murmansk, this.EasternEurope.Moscow);
    this._connect(this.EasternEurope.Murmansk, this.EasternEurope.Novosibirsk);

    this._connect(this.EasternEurope.Moscow, this.EasternEurope.Novosibirsk);
    this._connect(this.EasternEurope.Moscow, this.WesternAsia.Turkey);
    this._connect(this.EasternEurope.Moscow, this.WesternAsia.Iran);
    this._connect(this.EasternEurope.Moscow, this.CentralAsia.Kazakhstan);

    this._connect(this.EasternEurope.Novosibirsk, this.CentralAsia.Kazakhstan);
    this._connect(this.EasternEurope.Novosibirsk, this.EastAsia.Mongolia);
    this._connect(this.EasternEurope.Novosibirsk, this.EasternEurope.Vladivostok);

    this._connect(this.EasternEurope.Vladivostok, this.PacificOcean.SeaOfJapan);
    this._connect(this.EasternEurope.Vladivostok, this.EastAsia.Mongolia);
    this._connect(this.EasternEurope.Vladivostok, this.EastAsia.Beijing);
    this._connect(this.EasternEurope.Vladivostok, this.EastAsia.Korea);
  }
  #connectWesternAsianProvinces() {
    this._connect(this.WesternAsia.Turkey, this.AtlanticOcean.MediterraneanSea);
    this._connect(this.WesternAsia.Turkey, this.WesternEurope.Rome);
    this._connect(this.WesternAsia.Turkey, this.EasternEurope.Moscow);
    this._connect(this.WesternAsia.Turkey, this.WesternAsia.NearEast);
    this._connect(this.WesternAsia.Turkey, this.WesternAsia.Iran);

    this._connect(this.WesternAsia.NearEast, this.AtlanticOcean.MediterraneanSea);
    this._connect(this.WesternAsia.NearEast, this.Africa.NorthAfrica);
    this._connect(this.WesternAsia.NearEast, this.IndianOcean);
    this._connect(this.WesternAsia.NearEast, this.WesternAsia.Iran);

    this._connect(this.WesternAsia.Iran, this.IndianOcean);
    this._connect(this.WesternAsia.Iran, this.EasternEurope.Moscow);
    this._connect(this.WesternAsia.Iran, this.CentralAsia.Afghanistan);
    this._connect(this.WesternAsia.Iran, this.SouthernAsia.Mumbai);
  }
  #connectCentralAsianProvinces() {
    this._connect(this.CentralAsia.Kazakhstan, this.EasternEurope.Moscow);
    this._connect(this.CentralAsia.Kazakhstan, this.EasternEurope.Novosibirsk);
    this._connect(this.CentralAsia.Kazakhstan, this.EastAsia.Mongolia);
    this._connect(this.CentralAsia.Kazakhstan, this.CentralAsia.Afghanistan);
    this._connect(this.CentralAsia.Kazakhstan, this.EastAsia.Urumqi);

    this._connect(this.CentralAsia.Afghanistan, this.WesternAsia.Iran);
    this._connect(this.CentralAsia.Afghanistan, this.SouthernAsia.Mumbai);
    this._connect(this.CentralAsia.Afghanistan, this.SouthernAsia.NewDelhi);
    this._connect(this.CentralAsia.Afghanistan, this.EastAsia.Urumqi);
  }
  #connectSouthernAsianProvinces() {
    this._connect(this.SouthernAsia.Mumbai, this.IndianOcean);
    this._connect(this.SouthernAsia.Mumbai, this.WesternAsia.Iran);
    this._connect(this.SouthernAsia.Mumbai, this.CentralAsia.Afghanistan);
    this._connect(this.SouthernAsia.Mumbai, this.SouthernAsia.NewDelhi);
    this._connect(this.SouthernAsia.Mumbai, this.SouthernAsia.Chennai);
    this._connect(this.SouthernAsia.Mumbai, this.SouthernAsia.Kolkata);

    this._connect(this.SouthernAsia.NewDelhi, this.CentralAsia.Afghanistan);
    this._connect(this.SouthernAsia.NewDelhi, this.EastAsia.Urumqi);
    this._connect(this.SouthernAsia.NewDelhi, this.SouthernAsia.Kolkata);

    this._connect(this.SouthernAsia.Chennai, this.IndianOcean);
    this._connect(this.SouthernAsia.Chennai, this.SouthernAsia.Kolkata);

    this._connect(this.SouthernAsia.Kolkata, this.IndianOcean);
    this._connect(this.SouthernAsia.Kolkata, this.EastAsia.Urumqi);
    this._connect(this.SouthernAsia.Kolkata, this.EastAsia.Chongqing);
    this._connect(this.SouthernAsia.Kolkata, this.SouthEastAsia.IndoChina);
  }
  #connectEastAsianProvinces() {
    this._connect(this.EastAsia.Urumqi, this.CentralAsia.Kazakhstan);
    this._connect(this.EastAsia.Urumqi, this.CentralAsia.Afghanistan);
    this._connect(this.EastAsia.Urumqi, this.SouthernAsia.NewDelhi);
    this._connect(this.EastAsia.Urumqi, this.SouthernAsia.Kolkata);
    this._connect(this.EastAsia.Urumqi, this.EastAsia.Mongolia);
    this._connect(this.EastAsia.Urumqi, this.EastAsia.Beijing);
    this._connect(this.EastAsia.Urumqi, this.EastAsia.Chongqing);

    this._connect(this.EastAsia.Mongolia, this.CentralAsia.Kazakhstan);
    this._connect(this.EastAsia.Mongolia, this.EasternEurope.Novosibirsk);
    this._connect(this.EastAsia.Mongolia, this.EastAsia.Beijing);
    this._connect(this.EastAsia.Mongolia, this.EasternEurope.Vladivostok);

    this._connect(this.EastAsia.Beijing, this.PacificOcean.ChinaSea);
    this._connect(this.EastAsia.Beijing, this.EasternEurope.Vladivostok);
    this._connect(this.EastAsia.Beijing, this.EastAsia.Chongqing);
    this._connect(this.EastAsia.Beijing, this.EastAsia.Shanghai);
    this._connect(this.EastAsia.Beijing, this.EastAsia.Korea);

    this._connect(this.EastAsia.Chongqing, this.SouthernAsia.Kolkata);
    this._connect(this.EastAsia.Chongqing, this.EastAsia.Shanghai);
    this._connect(this.EastAsia.Chongqing, this.SouthEastAsia.IndoChina);

    this._connect(this.EastAsia.Shanghai, this.PacificOcean.ChinaSea);
    this._connect(this.EastAsia.Shanghai, this.SouthEastAsia.IndoChina);

    this._connect(this.EastAsia.Korea, this.PacificOcean.SeaOfJapan);
    this._connect(this.EastAsia.Korea, this.PacificOcean.ChinaSea);
    this._connect(this.EastAsia.Korea, this.EasternEurope.Vladivostok);

    this._connect(this.EastAsia.Japan, this.PacificOcean.SeaOfJapan);
  }
  #connectSouthEastAsianProvinces() {
    this._connect(this.SouthEastAsia.IndoChina, this.IndianOcean);
    this._connect(this.SouthEastAsia.IndoChina, this.PacificOcean.ChinaSea);
    this._connect(this.SouthEastAsia.IndoChina, this.SouthernAsia.Kolkata);
    this._connect(this.SouthEastAsia.IndoChina, this.EastAsia.Chongqing);
    this._connect(this.SouthEastAsia.IndoChina, this.EastAsia.Shanghai);

    this._connect(this.SouthEastAsia.Philippines, this.PacificOcean.ChinaSea);

    this._connect(this.SouthEastAsia.Indonesia, this.IndianOcean);
    this._connect(this.SouthEastAsia.Indonesia, this.PacificOcean.ChinaSea);
    this._connect(this.SouthEastAsia.Indonesia, this.PacificOcean.TasmanSea);
  }
  #connectOceanianProvinces() {
    this._connect(this.Oceania.Australia, this.PacificOcean.TasmanSea);

    this._connect(this.Oceania.NewZealand, this.PacificOcean.TasmanSea);
  }

  #connectOceanProvinces() {
    this._connect(this.AtlanticOcean.NorthAtlantic, this.AtlanticOcean.MediterraneanSea);
    this._connect(this.AtlanticOcean.NorthAtlantic, this.AtlanticOcean.CaribbeanSea);
    this._connect(this.AtlanticOcean.NorthAtlantic, this.AtlanticOcean.GulfOfGuinea);

    this._connect(this.AtlanticOcean.CaribbeanSea, this.AtlanticOcean.GulfOfGuinea);
    this._connect(this.AtlanticOcean.CaribbeanSea, this.AtlanticOcean.SouthAtlantic);

    this._connect(this.AtlanticOcean.GulfOfGuinea, this.AtlanticOcean.SouthAtlantic);
    this._connect(this.AtlanticOcean.GulfOfGuinea, this.IndianOcean);

    this._connect(this.AtlanticOcean.SouthAtlantic, this.PacificOcean.SouthPacific);
    this._connect(this.AtlanticOcean.SouthAtlantic, this.IndianOcean);

    this._connect(this.IndianOcean, this.PacificOcean.ChinaSea);
    this._connect(this.IndianOcean, this.PacificOcean.TasmanSea);

    this._connect(this.PacificOcean.SeaOfJapan, this.PacificOcean.NorthPacific);
    this._connect(this.PacificOcean.SeaOfJapan, this.PacificOcean.ChinaSea);

    this._connect(this.PacificOcean.ChinaSea, this.PacificOcean.NorthPacific);
    this._connect(this.PacificOcean.ChinaSea, this.PacificOcean.TasmanSea);
    this._connect(this.PacificOcean.ChinaSea, this.PacificOcean.SouthPacific);

    this._connect(this.PacificOcean.TasmanSea, this.PacificOcean.SouthPacific);

    this._connect(this.PacificOcean.NorthPacific, this.PacificOcean.SouthPacific);
  }

  #initializePorts() {
    this.NorthAmerica.SanFrancisco.portEgress = this.PacificOcean.NorthPacific;
    this.NorthAmerica.NewYork.portEgress = this.AtlanticOcean.NorthAtlantic;
    this.NorthAmerica.NewOrleans = this.AtlanticOcean.CaribbeanSea;

    this.SouthAmerica.Fortaleza.portEgress = this.AtlanticOcean.CaribbeanSea;
    this.SouthAmerica.RioDeJaneiro.portEgress = this.AtlanticOcean.SouthAtlantic;

    this.WesternEurope.London.portEgress = this.AtlanticOcean.NorthAtlantic;
    this.WesternEurope.Rome.portEgress = this.AtlanticOcean.MediterraneanSea;

    this.EasternEurope.Murmansk.portEgress = this.AtlanticOcean.NorthAtlantic;
    this.EasternEurope.Vladivostok.portEgress = this.PacificOcean.SeaOfJapan;

    this.SouthernAsia.Mumbai.portEgress = this.IndianOcean;
    this.SouthernAsia.Kolkata.portEgress = this.IndianOcean;

    this.EastAsia.Shanghai.portEgress = this.PacificOcean.ChinaSea;
  }
}
