import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    await task.save();

    return task;
  }

  async getTasks(@GetUser() user: User): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });
    const tasks = await query.getMany();
    return tasks;
  }
}
