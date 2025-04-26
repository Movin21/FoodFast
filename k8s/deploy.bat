@echo off
echo Creating namespace...
kubectl apply -f namespace.yaml

echo Applying secrets...
kubectl apply -f secrets.yaml -n food-delivery

echo Deploying API Gateway...
kubectl apply -f api-gateway-deployment.yaml -n food-delivery
kubectl apply -f api-gateway-service.yaml -n food-delivery

echo Deploying Auth Service...
kubectl apply -f auth-service-deployment.yaml -n food-delivery
kubectl apply -f auth-service-service.yaml -n food-delivery

echo Deploying Delivery Service...
kubectl apply -f delivery-service-deployment.yaml -n food-delivery
kubectl apply -f delivery-service-service.yaml -n food-delivery

echo Deploying Payment Service...
kubectl apply -f payment-service-deployment.yaml -n food-delivery
kubectl apply -f payment-service-service.yaml -n food-delivery

echo Deploying Notification Service...
kubectl apply -f notification-service-deployment.yaml -n food-delivery
kubectl apply -f notification-service-service.yaml -n food-delivery

echo Deployment complete!
echo To check status, run: kubectl get all -n food-delivery