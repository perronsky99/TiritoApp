/**
 * Datos de ubicación de Venezuela
 * Estados y Municipios
 */

export interface Municipio {
  id: string;
  nombre: string;
}

export interface Estado {
  id: string;
  nombre: string;
  municipios: Municipio[];
}

export const ESTADOS_VENEZUELA: Estado[] = [
  {
    id: 'amazonas',
    nombre: 'Amazonas',
    municipios: [
      { id: 'alto-orinoco', nombre: 'Alto Orinoco' },
      { id: 'atabapo', nombre: 'Atabapo' },
      { id: 'atures', nombre: 'Atures' },
      { id: 'autana', nombre: 'Autana' },
      { id: 'manapiare', nombre: 'Manapiare' },
      { id: 'maroa', nombre: 'Maroa' },
      { id: 'rio-negro', nombre: 'Río Negro' }
    ]
  },
  {
    id: 'anzoategui',
    nombre: 'Anzoátegui',
    municipios: [
      { id: 'anaco', nombre: 'Anaco' },
      { id: 'aragua-anzoategui', nombre: 'Aragua' },
      { id: 'bolivar-anzoategui', nombre: 'Bolívar' },
      { id: 'bruzual', nombre: 'Bruzual' },
      { id: 'cajigal', nombre: 'Cajigal' },
      { id: 'carvajal', nombre: 'Carvajal' },
      { id: 'diego-bautista-urbaneja', nombre: 'Diego Bautista Urbaneja' },
      { id: 'freites', nombre: 'Freites' },
      { id: 'guanipa', nombre: 'Guanipa' },
      { id: 'guanta', nombre: 'Guanta' },
      { id: 'independencia-anzoategui', nombre: 'Independencia' },
      { id: 'libertad-anzoategui', nombre: 'Libertad' },
      { id: 'mc-gregor', nombre: 'McGregor' },
      { id: 'miranda-anzoategui', nombre: 'Miranda' },
      { id: 'monagas-anzoategui', nombre: 'Monagas' },
      { id: 'penalver', nombre: 'Peñalver' },
      { id: 'piritu-anzoategui', nombre: 'Píritu' },
      { id: 'san-jose-de-guanipa', nombre: 'San José de Guanipa' },
      { id: 'san-juan-capistrano', nombre: 'San Juan de Capistrano' },
      { id: 'santa-ana-anzoategui', nombre: 'Santa Ana' },
      { id: 'simon-rodriguez', nombre: 'Simón Rodríguez' },
      { id: 'sotillo', nombre: 'Sotillo' }
    ]
  },
  {
    id: 'apure',
    nombre: 'Apure',
    municipios: [
      { id: 'achaguas', nombre: 'Achaguas' },
      { id: 'biruaca', nombre: 'Biruaca' },
      { id: 'munoz', nombre: 'Muñoz' },
      { id: 'paez-apure', nombre: 'Páez' },
      { id: 'pedro-camejo', nombre: 'Pedro Camejo' },
      { id: 'romulo-gallegos', nombre: 'Rómulo Gallegos' },
      { id: 'san-fernando', nombre: 'San Fernando' }
    ]
  },
  {
    id: 'aragua',
    nombre: 'Aragua',
    municipios: [
      { id: 'bolivar-aragua', nombre: 'Bolívar' },
      { id: 'camatagua', nombre: 'Camatagua' },
      { id: 'francisco-linares-alcantara', nombre: 'Francisco Linares Alcántara' },
      { id: 'girardot', nombre: 'Girardot' },
      { id: 'jose-angel-lamas', nombre: 'José Ángel Lamas' },
      { id: 'jose-felix-ribas', nombre: 'José Félix Ribas' },
      { id: 'jose-rafael-revenga', nombre: 'José Rafael Revenga' },
      { id: 'libertador-aragua', nombre: 'Libertador' },
      { id: 'mario-briceno-iragorry', nombre: 'Mario Briceño Iragorry' },
      { id: 'ocumare-de-la-costa-de-oro', nombre: 'Ocumare de la Costa de Oro' },
      { id: 'san-casimiro', nombre: 'San Casimiro' },
      { id: 'san-sebastian', nombre: 'San Sebastián' },
      { id: 'santiago-marino-aragua', nombre: 'Santiago Mariño' },
      { id: 'santos-michelena', nombre: 'Santos Michelena' },
      { id: 'sucre-aragua', nombre: 'Sucre' },
      { id: 'tovar-aragua', nombre: 'Tovar' },
      { id: 'urdaneta-aragua', nombre: 'Urdaneta' },
      { id: 'zamora-aragua', nombre: 'Zamora' }
    ]
  },
  {
    id: 'barinas',
    nombre: 'Barinas',
    municipios: [
      { id: 'alberto-arvelo-torrealba', nombre: 'Alberto Arvelo Torrealba' },
      { id: 'andres-eloy-blanco-barinas', nombre: 'Andrés Eloy Blanco' },
      { id: 'antonio-jose-de-sucre-barinas', nombre: 'Antonio José de Sucre' },
      { id: 'arismendi-barinas', nombre: 'Arismendi' },
      { id: 'barinas-capital', nombre: 'Barinas' },
      { id: 'bolivar-barinas', nombre: 'Bolívar' },
      { id: 'cruz-paredes', nombre: 'Cruz Paredes' },
      { id: 'ezequiel-zamora-barinas', nombre: 'Ezequiel Zamora' },
      { id: 'obispos', nombre: 'Obispos' },
      { id: 'pedraza', nombre: 'Pedraza' },
      { id: 'rojas', nombre: 'Rojas' },
      { id: 'sosa', nombre: 'Sosa' }
    ]
  },
  {
    id: 'bolivar',
    nombre: 'Bolívar',
    municipios: [
      { id: 'caroni', nombre: 'Caroní' },
      { id: 'cedeno-bolivar', nombre: 'Cedeño' },
      { id: 'el-callao', nombre: 'El Callao' },
      { id: 'gran-sabana', nombre: 'Gran Sabana' },
      { id: 'heres', nombre: 'Heres' },
      { id: 'piar', nombre: 'Piar' },
      { id: 'angostura-bolivar', nombre: 'Angostura' },
      { id: 'roscio', nombre: 'Roscio' },
      { id: 'sifontes', nombre: 'Sifontes' },
      { id: 'sucre-bolivar', nombre: 'Sucre' },
      { id: 'padre-pedro-chien', nombre: 'Padre Pedro Chien' }
    ]
  },
  {
    id: 'carabobo',
    nombre: 'Carabobo',
    municipios: [
      { id: 'bejuma', nombre: 'Bejuma' },
      { id: 'carlos-arvelo', nombre: 'Carlos Arvelo' },
      { id: 'diego-ibarra', nombre: 'Diego Ibarra' },
      { id: 'guacara', nombre: 'Guacara' },
      { id: 'juan-jose-mora', nombre: 'Juan José Mora' },
      { id: 'libertador-carabobo', nombre: 'Libertador' },
      { id: 'los-guayos', nombre: 'Los Guayos' },
      { id: 'miranda-carabobo', nombre: 'Miranda' },
      { id: 'montalban-carabobo', nombre: 'Montalbán' },
      { id: 'naguanagua', nombre: 'Naguanagua' },
      { id: 'puerto-cabello', nombre: 'Puerto Cabello' },
      { id: 'san-diego', nombre: 'San Diego' },
      { id: 'san-joaquin', nombre: 'San Joaquín' },
      { id: 'valencia', nombre: 'Valencia' }
    ]
  },
  {
    id: 'cojedes',
    nombre: 'Cojedes',
    municipios: [
      { id: 'anzoategui-cojedes', nombre: 'Anzoátegui' },
      { id: 'falcon-cojedes', nombre: 'Falcón' },
      { id: 'girardot-cojedes', nombre: 'Girardot' },
      { id: 'lima-blanco', nombre: 'Lima Blanco' },
      { id: 'pao-de-san-juan-bautista', nombre: 'Pao de San Juan Bautista' },
      { id: 'ricaurte-cojedes', nombre: 'Ricaurte' },
      { id: 'romulo-gallegos-cojedes', nombre: 'Rómulo Gallegos' },
      { id: 'san-carlos-cojedes', nombre: 'San Carlos' },
      { id: 'tinaco', nombre: 'Tinaco' }
    ]
  },
  {
    id: 'delta-amacuro',
    nombre: 'Delta Amacuro',
    municipios: [
      { id: 'antonio-diaz', nombre: 'Antonio Díaz' },
      { id: 'casacoima', nombre: 'Casacoima' },
      { id: 'pedernales', nombre: 'Pedernales' },
      { id: 'tucupita', nombre: 'Tucupita' }
    ]
  },
  {
    id: 'distrito-capital',
    nombre: 'Distrito Capital',
    municipios: [
      { id: 'libertador-dc', nombre: 'Libertador' }
    ]
  },
  {
    id: 'falcon',
    nombre: 'Falcón',
    municipios: [
      { id: 'acosta-falcon', nombre: 'Acosta' },
      { id: 'bolivar-falcon', nombre: 'Bolívar' },
      { id: 'buchivacoa', nombre: 'Buchivacoa' },
      { id: 'cacique-manaure', nombre: 'Cacique Manaure' },
      { id: 'carirubana', nombre: 'Carirubana' },
      { id: 'colina', nombre: 'Colina' },
      { id: 'dabajuro', nombre: 'Dabajuro' },
      { id: 'democracia', nombre: 'Democracia' },
      { id: 'falcon-capital', nombre: 'Falcón' },
      { id: 'federacion', nombre: 'Federación' },
      { id: 'jacura', nombre: 'Jacura' },
      { id: 'los-taques', nombre: 'Los Taques' },
      { id: 'mauroa', nombre: 'Mauroa' },
      { id: 'miranda-falcon', nombre: 'Miranda' },
      { id: 'monsenor-iturriza', nombre: 'Monseñor Iturriza' },
      { id: 'palmasola', nombre: 'Palmasola' },
      { id: 'petit', nombre: 'Petit' },
      { id: 'piritu-falcon', nombre: 'Píritu' },
      { id: 'san-francisco-falcon', nombre: 'San Francisco' },
      { id: 'silva', nombre: 'Silva' },
      { id: 'sucre-falcon', nombre: 'Sucre' },
      { id: 'tocopero', nombre: 'Tocópero' },
      { id: 'union-falcon', nombre: 'Unión' },
      { id: 'urumaco', nombre: 'Urumaco' },
      { id: 'zamora-falcon', nombre: 'Zamora' }
    ]
  },
  {
    id: 'guarico',
    nombre: 'Guárico',
    municipios: [
      { id: 'camaguan', nombre: 'Camaguán' },
      { id: 'chaguaramas', nombre: 'Chaguaramas' },
      { id: 'el-socorro', nombre: 'El Socorro' },
      { id: 'francisco-de-miranda-guarico', nombre: 'Francisco de Miranda' },
      { id: 'jose-felix-ribas-guarico', nombre: 'José Félix Ribas' },
      { id: 'jose-tadeo-monagas', nombre: 'José Tadeo Monagas' },
      { id: 'juan-german-roscio', nombre: 'Juan Germán Roscio' },
      { id: 'julian-mellado', nombre: 'Julián Mellado' },
      { id: 'las-mercedes-guarico', nombre: 'Las Mercedes' },
      { id: 'leonardo-infante', nombre: 'Leonardo Infante' },
      { id: 'ortiz', nombre: 'Ortiz' },
      { id: 'pedro-zaraza', nombre: 'Pedro Zaraza' },
      { id: 'san-geronimo-de-guayabal', nombre: 'San Gerónimo de Guayabal' },
      { id: 'san-jose-de-guaribe', nombre: 'San José de Guaribe' },
      { id: 'santa-maria-de-ipire', nombre: 'Santa María de Ipire' }
    ]
  },
  {
    id: 'la-guaira',
    nombre: 'La Guaira',
    municipios: [
      { id: 'vargas', nombre: 'Vargas' }
    ]
  },
  {
    id: 'lara',
    nombre: 'Lara',
    municipios: [
      { id: 'andres-eloy-blanco-lara', nombre: 'Andrés Eloy Blanco' },
      { id: 'crespo', nombre: 'Crespo' },
      { id: 'iribarren', nombre: 'Iribarren' },
      { id: 'jimenez', nombre: 'Jiménez' },
      { id: 'moran', nombre: 'Morán' },
      { id: 'palavecino', nombre: 'Palavecino' },
      { id: 'simon-planas', nombre: 'Simón Planas' },
      { id: 'torres', nombre: 'Torres' },
      { id: 'urdaneta-lara', nombre: 'Urdaneta' }
    ]
  },
  {
    id: 'merida',
    nombre: 'Mérida',
    municipios: [
      { id: 'alberto-adriani', nombre: 'Alberto Adriani' },
      { id: 'andres-bello-merida', nombre: 'Andrés Bello' },
      { id: 'antonio-pinto-salinas', nombre: 'Antonio Pinto Salinas' },
      { id: 'aricagua', nombre: 'Aricagua' },
      { id: 'arzobispo-chacon', nombre: 'Arzobispo Chacón' },
      { id: 'campo-elias', nombre: 'Campo Elías' },
      { id: 'caracciolo-parra-olmedo', nombre: 'Caracciolo Parra Olmedo' },
      { id: 'cardenal-quintero', nombre: 'Cardenal Quintero' },
      { id: 'guaraque', nombre: 'Guaraque' },
      { id: 'julio-cesar-salas', nombre: 'Julio César Salas' },
      { id: 'justo-briceno', nombre: 'Justo Briceño' },
      { id: 'libertador-merida', nombre: 'Libertador' },
      { id: 'miranda-merida', nombre: 'Miranda' },
      { id: 'obispo-ramos-de-lora', nombre: 'Obispo Ramos de Lora' },
      { id: 'padre-noguera', nombre: 'Padre Noguera' },
      { id: 'pueblo-llano', nombre: 'Pueblo Llano' },
      { id: 'rangel', nombre: 'Rangel' },
      { id: 'rivas-davila', nombre: 'Rivas Dávila' },
      { id: 'santos-marquina', nombre: 'Santos Marquina' },
      { id: 'sucre-merida', nombre: 'Sucre' },
      { id: 'tovar-merida', nombre: 'Tovar' },
      { id: 'tulio-febres-cordero', nombre: 'Tulio Febres Cordero' },
      { id: 'zea', nombre: 'Zea' }
    ]
  },
  {
    id: 'miranda',
    nombre: 'Miranda',
    municipios: [
      { id: 'acevedo', nombre: 'Acevedo' },
      { id: 'andres-bello-miranda', nombre: 'Andrés Bello' },
      { id: 'baruta', nombre: 'Baruta' },
      { id: 'brion', nombre: 'Brión' },
      { id: 'buroz', nombre: 'Buroz' },
      { id: 'carrizal', nombre: 'Carrizal' },
      { id: 'chacao', nombre: 'Chacao' },
      { id: 'cristobal-rojas', nombre: 'Cristóbal Rojas' },
      { id: 'el-hatillo', nombre: 'El Hatillo' },
      { id: 'guaicaipuro', nombre: 'Guaicaipuro' },
      { id: 'independencia-miranda', nombre: 'Independencia' },
      { id: 'lander', nombre: 'Lander' },
      { id: 'los-salias', nombre: 'Los Salias' },
      { id: 'paez-miranda', nombre: 'Páez' },
      { id: 'paz-castillo', nombre: 'Paz Castillo' },
      { id: 'pedro-gual', nombre: 'Pedro Gual' },
      { id: 'plaza', nombre: 'Plaza' },
      { id: 'simon-bolivar-miranda', nombre: 'Simón Bolívar' },
      { id: 'sucre-miranda', nombre: 'Sucre' },
      { id: 'urdaneta-miranda', nombre: 'Urdaneta' },
      { id: 'zamora-miranda', nombre: 'Zamora' }
    ]
  },
  {
    id: 'monagas',
    nombre: 'Monagas',
    municipios: [
      { id: 'acosta-monagas', nombre: 'Acosta' },
      { id: 'aguasay', nombre: 'Aguasay' },
      { id: 'bolivar-monagas', nombre: 'Bolívar' },
      { id: 'caripe', nombre: 'Caripe' },
      { id: 'cedeno-monagas', nombre: 'Cedeño' },
      { id: 'ezequiel-zamora-monagas', nombre: 'Ezequiel Zamora' },
      { id: 'libertador-monagas', nombre: 'Libertador' },
      { id: 'maturin', nombre: 'Maturín' },
      { id: 'piar-monagas', nombre: 'Piar' },
      { id: 'punceres', nombre: 'Punceres' },
      { id: 'santa-barbara-monagas', nombre: 'Santa Bárbara' },
      { id: 'sotillo-monagas', nombre: 'Sotillo' },
      { id: 'uracoa', nombre: 'Uracoa' }
    ]
  },
  {
    id: 'nueva-esparta',
    nombre: 'Nueva Esparta',
    municipios: [
      { id: 'antolin-del-campo', nombre: 'Antolín del Campo' },
      { id: 'arismendi-nueva-esparta', nombre: 'Arismendi' },
      { id: 'diaz', nombre: 'Díaz' },
      { id: 'garcia', nombre: 'García' },
      { id: 'gomez', nombre: 'Gómez' },
      { id: 'maneiro', nombre: 'Maneiro' },
      { id: 'marcano', nombre: 'Marcano' },
      { id: 'marino', nombre: 'Mariño' },
      { id: 'peninsula-de-macanao', nombre: 'Península de Macanao' },
      { id: 'tubores', nombre: 'Tubores' },
      { id: 'villalba', nombre: 'Villalba' }
    ]
  },
  {
    id: 'portuguesa',
    nombre: 'Portuguesa',
    municipios: [
      { id: 'agua-blanca', nombre: 'Agua Blanca' },
      { id: 'araure', nombre: 'Araure' },
      { id: 'esteller', nombre: 'Esteller' },
      { id: 'guanare', nombre: 'Guanare' },
      { id: 'guanarito', nombre: 'Guanarito' },
      { id: 'monsenor-jose-vicente-de-unda', nombre: 'Monseñor José Vicente de Unda' },
      { id: 'ospino', nombre: 'Ospino' },
      { id: 'paez-portuguesa', nombre: 'Páez' },
      { id: 'papelon', nombre: 'Papelón' },
      { id: 'san-genaro-de-boconoito', nombre: 'San Genaro de Boconoíto' },
      { id: 'san-rafael-de-onoto', nombre: 'San Rafael de Onoto' },
      { id: 'santa-rosalia', nombre: 'Santa Rosalía' },
      { id: 'sucre-portuguesa', nombre: 'Sucre' },
      { id: 'turen', nombre: 'Turén' }
    ]
  },
  {
    id: 'sucre',
    nombre: 'Sucre',
    municipios: [
      { id: 'andres-eloy-blanco-sucre', nombre: 'Andrés Eloy Blanco' },
      { id: 'andres-mata', nombre: 'Andrés Mata' },
      { id: 'arismendi-sucre', nombre: 'Arismendi' },
      { id: 'benitez', nombre: 'Benítez' },
      { id: 'bermudez', nombre: 'Bermúdez' },
      { id: 'bolivar-sucre', nombre: 'Bolívar' },
      { id: 'cajigal-sucre', nombre: 'Cajigal' },
      { id: 'cruz-salmeron-acosta', nombre: 'Cruz Salmerón Acosta' },
      { id: 'libertador-sucre', nombre: 'Libertador' },
      { id: 'marino-sucre', nombre: 'Mariño' },
      { id: 'mejia', nombre: 'Mejía' },
      { id: 'montes', nombre: 'Montes' },
      { id: 'ribero', nombre: 'Ribero' },
      { id: 'sucre-capital', nombre: 'Sucre' },
      { id: 'valdez', nombre: 'Valdez' }
    ]
  },
  {
    id: 'tachira',
    nombre: 'Táchira',
    municipios: [
      { id: 'andres-bello-tachira', nombre: 'Andrés Bello' },
      { id: 'antonio-romulo-costa', nombre: 'Antonio Rómulo Costa' },
      { id: 'ayacucho-tachira', nombre: 'Ayacucho' },
      { id: 'bolivar-tachira', nombre: 'Bolívar' },
      { id: 'cardenas', nombre: 'Cárdenas' },
      { id: 'cordoba-tachira', nombre: 'Córdoba' },
      { id: 'fernandez-feo', nombre: 'Fernández Feo' },
      { id: 'francisco-de-miranda-tachira', nombre: 'Francisco de Miranda' },
      { id: 'garcia-de-hevia', nombre: 'García de Hevia' },
      { id: 'guasimos', nombre: 'Guásimos' },
      { id: 'independencia-tachira', nombre: 'Independencia' },
      { id: 'jauregui', nombre: 'Jáuregui' },
      { id: 'jose-maria-vargas', nombre: 'José María Vargas' },
      { id: 'junin-tachira', nombre: 'Junín' },
      { id: 'libertad-tachira', nombre: 'Libertad' },
      { id: 'libertador-tachira', nombre: 'Libertador' },
      { id: 'lobatera', nombre: 'Lobatera' },
      { id: 'michelena', nombre: 'Michelena' },
      { id: 'panamericano', nombre: 'Panamericano' },
      { id: 'pedro-maria-urena', nombre: 'Pedro María Ureña' },
      { id: 'rafael-urdaneta-tachira', nombre: 'Rafael Urdaneta' },
      { id: 'samuel-dario-maldonado', nombre: 'Samuel Darío Maldonado' },
      { id: 'san-cristobal', nombre: 'San Cristóbal' },
      { id: 'seboruco', nombre: 'Seboruco' },
      { id: 'simon-rodriguez-tachira', nombre: 'Simón Rodríguez' },
      { id: 'sucre-tachira', nombre: 'Sucre' },
      { id: 'toribes', nombre: 'Torbes' },
      { id: 'uribante', nombre: 'Uribante' },
      { id: 'san-judas-tadeo', nombre: 'San Judas Tadeo' }
    ]
  },
  {
    id: 'trujillo',
    nombre: 'Trujillo',
    municipios: [
      { id: 'andres-bello-trujillo', nombre: 'Andrés Bello' },
      { id: 'bocono', nombre: 'Boconó' },
      { id: 'bolivar-trujillo', nombre: 'Bolívar' },
      { id: 'candelaria', nombre: 'Candelaria' },
      { id: 'carache', nombre: 'Carache' },
      { id: 'escuque', nombre: 'Escuque' },
      { id: 'jose-felipe-marquez-canizales', nombre: 'José Felipe Márquez Cañizales' },
      { id: 'juan-vicente-campo-elias', nombre: 'Juan Vicente Campo Elías' },
      { id: 'la-ceiba', nombre: 'La Ceiba' },
      { id: 'miranda-trujillo', nombre: 'Miranda' },
      { id: 'monte-carmelo', nombre: 'Monte Carmelo' },
      { id: 'motatan', nombre: 'Motatán' },
      { id: 'pampan', nombre: 'Pampán' },
      { id: 'pampanito', nombre: 'Pampanito' },
      { id: 'rafael-rangel', nombre: 'Rafael Rangel' },
      { id: 'san-rafael-de-carvajal', nombre: 'San Rafael de Carvajal' },
      { id: 'sucre-trujillo', nombre: 'Sucre' },
      { id: 'trujillo-capital', nombre: 'Trujillo' },
      { id: 'urdaneta-trujillo', nombre: 'Urdaneta' },
      { id: 'valera', nombre: 'Valera' }
    ]
  },
  {
    id: 'yaracuy',
    nombre: 'Yaracuy',
    municipios: [
      { id: 'aristides-bastidas', nombre: 'Arístides Bastidas' },
      { id: 'bolivar-yaracuy', nombre: 'Bolívar' },
      { id: 'bruzual-yaracuy', nombre: 'Bruzual' },
      { id: 'cocorote', nombre: 'Cocorote' },
      { id: 'independencia-yaracuy', nombre: 'Independencia' },
      { id: 'jose-antonio-paez', nombre: 'José Antonio Páez' },
      { id: 'la-trinidad', nombre: 'La Trinidad' },
      { id: 'manuel-monge', nombre: 'Manuel Monge' },
      { id: 'nirgua', nombre: 'Nirgua' },
      { id: 'pena-yaracuy', nombre: 'Peña' },
      { id: 'san-felipe', nombre: 'San Felipe' },
      { id: 'sucre-yaracuy', nombre: 'Sucre' },
      { id: 'urachiche', nombre: 'Urachiche' },
      { id: 'veroes', nombre: 'Veroes' }
    ]
  },
  {
    id: 'zulia',
    nombre: 'Zulia',
    municipios: [
      { id: 'almirante-padilla', nombre: 'Almirante Padilla' },
      { id: 'baralt', nombre: 'Baralt' },
      { id: 'cabimas', nombre: 'Cabimas' },
      { id: 'catatumbo', nombre: 'Catatumbo' },
      { id: 'colon-zulia', nombre: 'Colón' },
      { id: 'francisco-javier-pulgar', nombre: 'Francisco Javier Pulgar' },
      { id: 'guajira', nombre: 'Guajira' },
      { id: 'jesus-enrique-lossada', nombre: 'Jesús Enrique Lossada' },
      { id: 'jesus-maria-semprun', nombre: 'Jesús María Semprún' },
      { id: 'la-canada-de-urdaneta', nombre: 'La Cañada de Urdaneta' },
      { id: 'lagunillas', nombre: 'Lagunillas' },
      { id: 'machiques-de-perija', nombre: 'Machiques de Perijá' },
      { id: 'mara', nombre: 'Mara' },
      { id: 'maracaibo', nombre: 'Maracaibo' },
      { id: 'miranda-zulia', nombre: 'Miranda' },
      { id: 'rosario-de-perija', nombre: 'Rosario de Perijá' },
      { id: 'san-francisco-zulia', nombre: 'San Francisco' },
      { id: 'santa-rita', nombre: 'Santa Rita' },
      { id: 'simon-bolivar-zulia', nombre: 'Simón Bolívar' },
      { id: 'sucre-zulia', nombre: 'Sucre' },
      { id: 'valmore-rodriguez', nombre: 'Valmore Rodríguez' }
    ]
  }
];

/**
 * Tipos de documento de identidad
 */
export const TIPOS_DOCUMENTO = [
  { id: 'V', nombre: 'Venezolano (V)' },
  { id: 'E', nombre: 'Extranjero (E)' }
];

/**
 * Obtener municipios por estado
 */
export function getMunicipiosByEstado(estadoId: string): Municipio[] {
  const estado = ESTADOS_VENEZUELA.find(e => e.id === estadoId);
  return estado ? estado.municipios : [];
}
