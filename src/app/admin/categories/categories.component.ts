import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {CategoriesService} from './categories.service';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  deleteModal = false;
  updateModal = false;
  insertModal = false;
  filter: string;
  categoriesList: any;
  form: FormGroup;
  cid: number;
  updateForm: FormGroup;


  constructor(private categoriesService: CategoriesService,
              private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.categoriesService.getAllCategories().subscribe((data: any) => {
      this.categoriesList = data;
      console.log(this.categoriesList);
    });


    this.form = this.formBuilder.group({
      id: [1],
      name: [''],
      recordStatus: [''],
      createDateTime: [''],
      updateDateTime: [''],
      deletedDateTime: [''],
      description: [''],
      version: [''],
    });

    this.updateForm = this.formBuilder.group({
      name: [''],
      recordStatus: [''],
      updateDateTime: [],
      deletedDateTime: [],
      description: [''],
      version: [],
    });

    console.log(this.updateForm);

  }

  public captureScreen() {
    const data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = 10;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('categories.pdf');
    });
  }

  onSubmit() {
    const values = this.form.value;
    console.log('on Submit', values);
    this.categoriesService.registerCategory(values).subscribe(
      get => {
        this.categoriesService.getAllCategories().subscribe((data: any) => {
          this.categoriesList = data;
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );

    this.insertModal = false;

  }


  onDelete() {
    this.categoriesService.deleteCategory(this.cid).subscribe(
      get => {
        this.categoriesService.getAllCategories().subscribe((data: any) => {
          this.categoriesList = data;
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
    this.toggleModal();

  }

  onUpdate() {
    const values = this.updateForm.value;
    console.log(values);
    this.categoriesService.updateCategory(values).subscribe(
      get => {
        this.categoriesService.getAllCategories().subscribe((data: any) => {
          this.categoriesList = data;
        });
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
    this.updateModal = false;
  }

  openInsert() {
    console.log('insert is called');
    this.insertModal = true;
    console.log('from open insert', this.insertModal);
  }

  openUpdate(
    id,
    name,
    recordStatus,
    updateDateTime,
    deletedDateTime,
    description,
    version: number) {
    this.cid = id;
    this.updateModal = true;
    this.updateForm.controls.name.setValue(name);
    this.updateForm.controls.recordStatus.setValue(recordStatus);
    this.updateForm.controls.updateDateTime.setValue(updateDateTime);
    this.updateForm.controls.deletedDateTime.setValue(deletedDateTime);
    this.updateForm.controls.description.setValue(description);
    this.updateForm.controls.version.setValue(version);

  }

  closeUpdateModal() {
    this.updateModal = !this.updateModal;
    this.form.reset();
    this.updateForm.reset();
  }

  closeInsertModal() {
    this.insertModal = !this.insertModal;
    this.form.reset();
    this.updateForm.reset();
  }

  toggleModal() {
    this.deleteModal = !this.deleteModal;
    this.form.reset();
    this.updateForm.reset();
  }

  openDelete(cid) {
    this.deleteModal = true;
    this.cid = cid;
    console.log(this.cid);
  }


}