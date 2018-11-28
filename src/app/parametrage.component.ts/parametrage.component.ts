import { Enfant } from './../models/enfant';
import { Employe } from './../models/employe';
import { Component, TemplateRef } from "@angular/core";

import { HttpService } from './../services/http.service';

import { forkJoin } from 'rxjs/observable/forkJoin';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Observable } from 'rxjs';


@Component({
  selector: "parametrage",
  templateUrl: "./parametrage.component.html",
  styleUrls: ["./parametrage.component.css"]
})
export class ParametrageComponent {

  public enfants;
  public employes: Array<Employe>;
  public modelEmploye = {};
  public modelEnfant = {};
  public modalRef: BsModalRef;
  public toDelete;

  constructor(public httpService: HttpService, private modalService: BsModalService) {
    this.loadData();
  }

  private loadData() {
    var employesCall = this.httpService.getAllEmployes();
    var enfantsCall = this.httpService.getAllEnfants();

    forkJoin(employesCall, enfantsCall).subscribe((results: any) => {

      this.employes = results[0];
      this.initModelEmployes(this.employes);

      this.enfants = results[1];
      this.initModelEnfants(this.enfants, this.employes);
    });
  }

  private initModelEmployes(employes: Array<Employe>) {
    this.employes.forEach((employe: Employe) => {
      this.modelEmploye[employe.id] = this.forkEmployeModel(employe);
    });
  }

  private forkEmployeModel(employe: Employe) {
    return Employe.fork(employe);
  }

  private initModelEnfants(enfants, enployes) {
      enfants.forEach(enfant => {
        var listeEmployesEnfant = [];
        enfant.employesIds.forEach(empId => {
          listeEmployesEnfant.push(enployes.find(employe => {
            return employe.id === empId;
          }))
        });
        this.modelEnfant[enfant.id] = this.forkEnfantModel(enfant, listeEmployesEnfant);
      });
  }

  private forkEnfantModel(enfant, listeEmployesEnfant) {
    var newEnfant = Enfant.fork(enfant);
    newEnfant.employes = listeEmployesEnfant;
    return newEnfant;
  }

  private openDeleteModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  private deleteEnfantService(enfantId) {
    return this.httpService.deleteParamEnfant(enfantId);
  }

  private deleteEmployeService(employeId) {
    return this.httpService.deleteParamEmploye(employeId);
  }

  // INTERFACE
  // ---------

  public reinitEmployes() {
    this.initModelEmployes(this.employes);
  }

  public reinitEnfants() {
    this.initModelEnfants(this.enfants, this.employes);
  }

  public saveEmploye(employeId) {
    console.log(this.modelEmploye[employeId]);
  }

  public saveEnfant(enfantId) {
    console.log(this.modelEnfant[enfantId]);
  }

  public deleteEmploye(employeId, template: TemplateRef<any>) {
    this.toDelete = {
      id: employeId,
      name: this.modelEmploye[employeId].prenom + " " + this.modelEmploye[employeId].nom,
      deleteFunction: "employe",
      deleteEnCours: false
    }
    this.openDeleteModal(template);
  }

  public deleteEnfant(enfantId, template: TemplateRef<any>) {
    this.toDelete = {
      id: enfantId,
      name: this.modelEnfant[enfantId].nom,
      deleteFunction: "enfant",
      deleteEnCours: false
    }
    this.openDeleteModal(template);
  }

  public confirmDeletion(deleteFunction, paramId) {
    this.toDelete.deleteEnCours = true;
    if(deleteFunction === "enfant") {
      this.deleteEnfantService(paramId).subscribe(
        ok => {
          this.toDelete.deleteEnCours = false;
          this.modalRef.hide();
        }, ko => {
          this.toDelete.deleteEnCours = false;
        }
        );
      } else if (deleteFunction === "employe") {
        console.log("employe")
      this.deleteEmployeService(paramId).subscribe(ok => {
        this.toDelete.deleteEnCours = false;
        this.modalRef.hide();
      }, ko => {
        this.toDelete.deleteEnCours = false;
      });
    }
  }

  public declineDeletion() {
    this.modalRef.hide();
  }
}
