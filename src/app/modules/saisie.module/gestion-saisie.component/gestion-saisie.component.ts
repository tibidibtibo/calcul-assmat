import { ReferentielService } from './../../../services/referentiel.service';
import { Component } from "@angular/core";
import { HttpService } from "../../../services/http.service";
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: "gestion-saisie",
  templateUrl: "./gestion-saisie.component.html",
  styleUrls: ["./gestion-saisie.component.css"]
})
export class GestionSaisieComponent {

  constructor(private httpService: HttpService, private refService: ReferentielService) {

    var referentielsCall = refService.loadEnfantEtEmployes();
    var findSaisieCall = httpService.findSaisieMonth(this.monthSelected, this.yearSelected);

    forkJoin(findSaisieCall, referentielsCall).subscribe(data => {
      this.donneesSaisies = data[0];
      this.referentielEmployeEtEnfant = data[1];

      // TODO : consolider saisie avec référentiel
    });
  }

  public monthSelected = ((new Date()).getMonth() + 1).toString().padStart(2, "0");
  public yearSelected = (new Date()).getFullYear();
  public donneesSaisies = null;
  public referentielEmployeEtEnfant = null;
}
