export class UrlEndpoints {

  constructor() {
  }
  //public static BASE_URL :string ="http://timetable-api.njs.jelastic.vps-host.net/timetable-technical";
  //public static BASE_URL :string ="http://localhost:8085";
  public static BASE_URL :string ="http://192.168.60.1:8085";//when accessing from a different device,eg phone,ip address is needed instead of localhost
  public static TUTOR_ENDPOINT :string =UrlEndpoints.BASE_URL+"/tutor";
  public static DEPARTMENT_ENDPOINT :string =UrlEndpoints.BASE_URL+"/department";
  public static SUBJECT_ENDPOINT : string=UrlEndpoints.BASE_URL+"/subject";
  public static SUBJECT_ALLOCATION_ENDPOINT : string=UrlEndpoints.SUBJECT_ENDPOINT+"/allocation";

}
