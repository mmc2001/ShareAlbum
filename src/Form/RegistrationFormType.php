<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;


class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', EmailType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'El email no puede estar vacío']),
                ],
            ])
            ->add('name', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'El nombre no puede estar vacío']),
                ],
            ])
            ->add('surnames', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'Los apellidos no pueden estar vacíos']),
                ],
            ])
            ->add('dni', TextType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'El DNI no puede estar vacío']),
                ],
            ])
            ->add('telephone', TelType::class, [
                'constraints' => [
                    new NotBlank(['message' => 'El teléfono no puede estar vacío']),
                ],
            ])
            ->add('roles', ChoiceType::class, [
                'choices'  => [
                    'User' => 'ROLE_USER',
                    'Admin' => 'ROLE_ADMIN_USER',
                ],
                'mapped' => false,
                'multiple' => false,
                'expanded' => false,
                'constraints' => [
                    new NotBlank(['message' => 'Por favor, elija un rol']),
                ],
            ])
            /*
            ->add('agreeTerms', CheckboxType::class, [
                'mapped' => false,
                'constraints' => [
                    new IsTrue([
                        'message' => 'You should agree to our terms.',
                    ]),
                ],
            ])
            */
            ->add('plainPassword', PasswordType::class, [
                // Instead of being set onto the object directly,
                // this is read and encoded in the controller
                'mapped' => false,
                'attr' => ['autocomplete' => 'new-password'],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Please enter a password',
                    ]),
                    new Length([
                        'min' => 6,
                        'minMessage' => 'Your password should be at least {{ limit }} characters',
                        // Max length allowed by Symfony for security reasons
                        'max' => 4096,
                    ]),
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
