let chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;

describe('Test the /Restaurants route :', () => {

  const url = '/restaurants';

  it('Should LIST ALL Restaurants on /Restaurants GET', (done) => {

    chai.request(process.env.DATABASE_URL)
      .get(url)
      .end(function(err, res) {

        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body[0]).to.have.all.keys('id', 'text');
        expect(res.body[0].text).to.be.a('string');

        done();
      });
  });


});