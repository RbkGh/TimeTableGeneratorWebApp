import { EduAppPage } from './app.po';

describe('edu-app App', function() {
  let page: EduAppPage;

  beforeEach(() => {
    page = new EduAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
