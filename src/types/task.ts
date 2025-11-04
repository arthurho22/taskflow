export type TaskStatus = 'pendente' | 'andamento' | 'concluida'

export interface Task {
  id?: string            
  userId: string         
  title: string        
  description?: string   
  status: TaskStatus     
  createdAt: number      
  updatedAt?: number    
}
