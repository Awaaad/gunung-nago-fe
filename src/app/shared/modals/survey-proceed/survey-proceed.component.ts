import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-survey-proceed',
  templateUrl: './survey-proceed.component.html',
  styleUrls: ['./survey-proceed.component.scss'],
})
export class SurveyProceedComponent {

  public editRoleForm: FormGroup;
  public role: any;

  public errorMessages = {
    roleName: [
      { type: 'required', message: '🔴 Role name is required' },
    ]
  };

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
    // private roleApiService: RoleApiService,
    private utilService: UtilsService
  ) {
    // this.role = this.navParams.data.role;
    this.editRoleForm = this.formBuilder.group({
      roleId: new FormControl(1),
      role: new FormControl(
        'AV',
        Validators.compose([Validators.required])
      )
    })
  }

  ngOnInit() {

  }

  onSubmit() {
  }

  // close modal
  public closeModal(): void {
    this.modalController.dismiss();
  }
}
