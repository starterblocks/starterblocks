<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitde102a8941157d664437230da30a7442
{
    public static $prefixLengthsPsr4 = array (
        'S' => 
        array (
            'StarterBlocks\\' => 14,
        ),
        'C' => 
        array (
            'Composer\\Installers\\' => 20,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'StarterBlocks\\' => 
        array (
            0 => __DIR__ . '/../..' . '/core',
        ),
        'Composer\\Installers\\' => 
        array (
            0 => __DIR__ . '/..' . '/composer/installers/src/Composer/Installers',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitde102a8941157d664437230da30a7442::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitde102a8941157d664437230da30a7442::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}