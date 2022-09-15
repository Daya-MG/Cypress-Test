
import util from '../util/util';
// Instantiate the utility object to access all it's methods
const utilFunctions=new util();

describe('launch the link and check if sharebar is present', ()=>{
    it('launches the test article and checks the sharebar icons', ()=>{
        utilFunctions.launcharticle();
        utilFunctions.checkForShareBar();
        utilFunctions.checkArrowExtension();
    });
});