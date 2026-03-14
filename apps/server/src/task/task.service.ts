import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskTemplate } from './entities/task-template.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskTemplate)
    private templateRepository: Repository<TaskTemplate>,
  ) {}

  async create(createDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createDto);
    return this.taskRepository.save(task);
  }

  async findAll(propertyId: string): Promise<Task[]> {
    return this.taskRepository.find({
      where: { propertyId },
      relations: ['room', 'assignee'],
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['room', 'assignee', 'booking'],
    });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  async update(id: string, updateDto: UpdateTaskDto): Promise<Task> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.taskRepository.update(id, updateDto as any);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Task with ID ${id} not found`);
  }

  // Template methods
  async createTemplate(templateDto: any): Promise<TaskTemplate> {
    const template = this.templateRepository.create(templateDto as object);
    return this.templateRepository.save(template);
  }

  async getTemplates(propertyId: string): Promise<TaskTemplate[]> {
    return this.templateRepository.find({ where: { propertyId } });
  }
}
