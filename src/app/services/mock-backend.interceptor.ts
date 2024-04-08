import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const { url, method, headers, body } = request;

    const authHeader = headers.get('Authorization');

    if (url.endsWith('/login') && method === 'POST') {
      const { email, password } = body as any;

      const user = users.find(x => x.email === email && x.password === password);

      if (!user) {
        return of(new HttpResponse({
          status: 400,
          body: { message: 'Email or password is incorrect' }
        }));
      }

      return of(new HttpResponse({
        status: 200,
        body: {
          id: user.id,
          email: user.email,
          token: `fake-jwt-token-${user.id}`
        }
      }));
    }

    if(!authHeader || !this.getUserIdFromToken(authHeader)) {
      return this.unauthorized();
    }

    const userId = this.getUserIdFromToken(authHeader);

    if (url.endsWith('/profile') && method === 'GET') {

      const profile = profiles.find(x => x.userId === userId);

      if (!profile) {
        return this.notFound();
      }

      return of(new HttpResponse({
        status: 200,
        body: profile
      }));
    }

    if (url.endsWith('/profile') && method === 'PUT') {

      const updatedProfile = body as IProfile;

      const index = profiles.findIndex(x => x.userId === userId);

      if (index === -1) {
        return this.notFound();
      }

      profiles[index] = updatedProfile;

      return of(new HttpResponse({
        status: 200,
        body: updatedProfile
      }));
    }

    if(url.endsWith('/law-process') && method === 'GET') {

      const userLawProcesses = lawProcesses.filter(x => x.userId === userId);

      if(request.params.has('id')) {
        const id = request.params.get('id');
        const lawProcess = userLawProcesses.find(x => x.id === +id!);

        if(!lawProcess) {
          return this.notFound();
        }

        return of(new HttpResponse({
          status: 200,
          body: lawProcess
        }));
      }


      return of(new HttpResponse({
        status: 200,
        body: userLawProcesses
      }));
    }

    if(url.endsWith('/law-process') && method === 'POST') {


      const newLawProcess = body as ILawProcess;

      newLawProcess.userId = userId;

      newLawProcess.id = lawProcesses.length ? Math.max(...lawProcesses.map(x => x.id)) + 1 : 1;

      lawProcesses.push(newLawProcess);

      return of(new HttpResponse({
        status: 200,
        body: newLawProcess
      }));
    }

    if(url.endsWith('/law-process') && method === 'PUT') {


      const updatedLawProcess = body as ILawProcess;

      const index = lawProcesses.findIndex(x => x.id === updatedLawProcess.id && x.userId === userId);

      if(index === -1) {
        return this.notFound();
      }

      lawProcesses[index].area = updatedLawProcess.area;
      lawProcesses[index].court = updatedLawProcess.court;
      lawProcesses[index].description = updatedLawProcess.description;
      lawProcesses[index].processNumber = updatedLawProcess.processNumber;
      lawProcesses[index].status = updatedLawProcess.status;

      return of(new HttpResponse({
        status: 200,
        body: updatedLawProcess
      }));
    }

    if(url.includes('/law-process/') && method === 'DELETE') {


      const id = url.split('/').pop();

      if(!id) {
        return this.badRequest();
      }

      const index = lawProcesses.findIndex(x => x.id === +id && x.userId === userId);

      if(index === -1) {
        return this.notFound();
      }

      lawProcesses.splice(index, 1);

      return of(new HttpResponse({
        status: 200,
        body: {}
      }));
    }

    if(url.includes('/law-process/') && method === 'PATCH') {

        const id = url.split('/').pop();

        if(!id) {
          return this.badRequest();
        }

        const updatedStatus = body as { status: 'todo' | 'progress' | 'completed' };

        const index = lawProcesses.findIndex(x => x.id === +id && x.userId === userId);

        if(index === -1) {
          return this.notFound();
        }

        lawProcesses[index].status = updatedStatus.status;

        return of(new HttpResponse({
          status: 200,
          body: lawProcesses[index]
        }));
    }

    return this.notFound();
  }

  unauthorized() {
    return of(new HttpResponse({
      status: 401,
      body: { message: 'Unauthorized' }
    }));
  }

  notFound() {
    return of(new HttpResponse({
      status: 404,
      body: { message: 'Not Found' }
    }));
  }

  badRequest() {
    return of(new HttpResponse({
      status: 400,
      body: { message: 'Bad Request' }
    }));
  }

  getUserIdFromToken(token: string) {
    const userId = parseInt(token.split('-')[3]);
    return userId;
  }
}

export interface IUser {
  id: number;
  email: string;
  password: string;
}

export interface IProfile {
  id: number;
  userId: number;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  social: {
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
  };
  experience: {
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
}

export interface ILawProcess {
  id: number;
  userId: number;
  processNumber: string;
  court: string;
  area: string;
  description: string;
  status: 'todo' | 'progress' | 'completed';
}

const users = [
  { id: 1, email: 'john.doe@gmail.com', password: '1!JohnDoe'},
  { id: 2, email: 'jane.doe@gmail.com', password: '2!JaneDoe'},
];

const profiles = [
  {
    id: 1,
    userId: 1,
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/port',
    bio: '',
    location: 'Belo Horizonte, MG',
    website: 'https://johndoe.com.br',
    social: {
      twitter: '',
      facebook: '',
      linkedin: 'https://linkedin.com/john.doe',
      instagram: '',
    },
    experience: []
  },
  {
    id: 2,
    userId: 2,
    name: 'Jane Doe',
    avatar: 'https://randomuser.me/api/port',
    bio: '',
    location: 'São Paulo, SP',
    website: 'https://janedoe.com.br',
    social: {
      twitter: '',
      facebook: '',
      linkedin: 'https://linkedin.com/jane.doe',
      instagram: '',
    },
    experience: [
      {
        id: 1,
        company: 'Escritório A',
        position: 'Estagiário',
        startDate: '2020-01-01',
        endDate: '2021-01-01',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex'
      },
      {
        id: 2,
        company: 'Escritório B',
        position: 'Advogado Associado',
        startDate: '2021-01-02',
        endDate: '2022-05-12',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex'
      },
    ]
  },
]

const lawProcesses = [
  {
    id: 1,
    userId: null,
    processNumber: '111111111',
    court: 'Tribunal de Justiça de Minas Gerais',
    area: 'Direito Civil',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex',
    status: 'todo',
  },
  {
    id: 2,
    userId: 1,
    processNumber: '222222222',
    court: 'Tribunal de Justiça de São Paulo',
    area: 'Direito Penal',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex',
    status: 'progress',
  },
  {
    id: 3,
    userId: 2,
    processNumber: '333333333',
    court: 'Tribunal de Justiça de Minas Gerais',
    area: 'Direito Civil',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex',
    status: 'progress',
  },
  {
    id: 4,
    userId: 2,
    processNumber: '444444444',
    court: 'Tribunal de Justiça de São Paulo',
    area: 'Direito Penal',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex',
    status: 'completed',
  },
  {
    id: 5,
    userId: 2,
    processNumber: '555555555',
    court: 'Tribunal de Justiça de Minas Gerais',
    area: 'Direito Trabalhista',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex',
    status: 'todo',
  },
  {
    id: 6,
    userId: 1,
    processNumber: '666666666',
    court: 'Tribunal de Justiça de São Paulo',
    area: 'Direito Administrativo',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex',
    status: 'progress',
  },
  {
    id: 7,
    userId: 2,
    processNumber: '777777777',
    court: 'Tribunal de Justiça de Minas Gerais',
    area: 'Direito Tributário',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex',
    status: 'progress',
  },
  {
    id: 8,
    userId: 2,
    processNumber: '888888888',
    court: 'Tribunal de Justiça de São Paulo',
    area: 'Direito Penal',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex',
    status: 'completed',
  },
  {
    id: 9,
    userId: 1,
    processNumber: '999999999',
    court: 'Tribunal de Justiça de Minas Gerais',
    area: 'Direito Civil',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex',
    status: 'todo',
  },
  {
    id: 10,
    userId: 1,
    processNumber: '101010101',
    court: 'Tribunal de Justiça de São Paulo',
    area: 'Direito Penal',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, purus nec ultricies luctus, libero sapien lacinia eros, nec ultricies ex',
    status: 'completed',
  },
];
