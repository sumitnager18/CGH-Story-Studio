export interface AssetSourceDefinition {
  id:string;
  name:string;
  website:string;
  license:string;
  licenseUrl:string;
  commercialUse:'yes'|'review';
  redistribution:'yes'|'no'|'conditional';
  notes:string;
}
export const ASSET_SOURCES:AssetSourceDefinition[] = [
  {id:'kenney',name:'Kenney',website:'https://kenney.nl/assets',license:'CC0',licenseUrl:'https://kenney.nl/support',commercialUse:'yes',redistribution:'yes',notes:'Strong foundation for game/UI/2D/3D assets.'},
  {id:'polyhaven',name:'Poly Haven',website:'https://polyhaven.com',license:'CC0',licenseUrl:'https://polyhaven.com/license',commercialUse:'yes',redistribution:'yes',notes:'HDRIs, textures and 3D models.'},
  {id:'pexels',name:'Pexels',website:'https://www.pexels.com',license:'Pexels License',licenseUrl:'https://www.pexels.com/license/',commercialUse:'yes',redistribution:'conditional',notes:'Use inside projects; do not treat the stock library as a redistributable bundle.'},
  {id:'pixabay',name:'Pixabay',website:'https://pixabay.com',license:'Pixabay Content License',licenseUrl:'https://pixabay.com/service/license-summary/',commercialUse:'yes',redistribution:'conditional',notes:'Check trademarks, recognizable people and standalone redistribution restrictions.'},
  {id:'mixkit',name:'Mixkit',website:'https://mixkit.co',license:'Mixkit License',licenseUrl:'https://mixkit.co/license/',commercialUse:'yes',redistribution:'conditional',notes:'Check the individual item license, especially templates and SFX.'},
  {id:'freesound',name:'Freesound',website:'https://freesound.org',license:'Per-file license',licenseUrl:'https://freesound.org/help/faq/',commercialUse:'review',redistribution:'conditional',notes:'Filter for CC0/appropriate commercial licenses; avoid NC assets for commercial work.'},
  {id:'opengameart',name:'OpenGameArt',website:'https://opengameart.org',license:'Per-file open license',licenseUrl:'https://opengameart.org/content/faq',commercialUse:'review',redistribution:'conditional',notes:'Record each asset license and attribution requirements.'},
  {id:'wikimedia',name:'Wikimedia Commons',website:'https://commons.wikimedia.org',license:'Per-file license',licenseUrl:'https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia',commercialUse:'review',redistribution:'conditional',notes:'License varies by file.'},
  {id:'nasa-svs',name:'NASA Scientific Visualization Studio',website:'https://svs.gsfc.nasa.gov',license:'Generally public domain, exceptions apply',licenseUrl:'https://svs.gsfc.nasa.gov/help/',commercialUse:'yes',redistribution:'conditional',notes:'Check each visualization for third-party music/material.'}
];
